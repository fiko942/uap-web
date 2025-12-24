<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Tymon\JWTAuth\Contracts\JWTSubject;

use Illuminate\Support\Str;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'name',
        'email',
        'password',
        'role',
        'created_by_admin_id',
        'is_banned',
        'banned_at',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function ($user) {
            $user->uuid = (string) Str::uuid();
            if (!$user->role) {
                $user->role = 'customer';
            }
        });
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_banned' => 'boolean',
            'banned_at' => 'datetime',
        ];
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            'is_banned' => $this->is_banned,
            'permissions' => $this->permissions->pluck('key'),
            'features' => $this->featureFlags->pluck('key'),
        ];
    }

    // Relationships
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'user_permissions');
    }

    public function featureFlags()
    {
        return $this->belongsToMany(FeatureFlag::class, 'feature_flag_user');
    }

    public function inviter()
    {
        return $this->belongsTo(User::class, 'created_by_admin_id');
    }

    public function invitees()
    {
        return $this->hasMany(User::class, 'created_by_admin_id');
    }

    // Helpers
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isSuperAdmin()
    {
        return $this->isAdmin() && $this->email === 'tobellord@gmail.com';
    }

    public function hasPermission($key)
    {
        return $this->permissions()->where('key', $key)->exists();
    }

    public function hasFeature($key)
    {
        return $this->featureFlags()->where('key', $key)->where('is_enabled', true)->exists();
    }
}
