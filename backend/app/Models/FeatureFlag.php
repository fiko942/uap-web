<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class FeatureFlag extends Model
{
    protected $fillable = ['key', 'is_enabled'];

    protected $casts = [
        'is_enabled' => 'boolean',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'feature_flag_user');
    }
}
