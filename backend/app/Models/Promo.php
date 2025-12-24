<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Str;

class Promo extends Model
{
    protected $fillable = [
        'uuid',
        'name',
        'type',
        'value',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'value' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected static function booted()
    {
        static::creating(function ($promo) {
            $promo->uuid = (string) Str::uuid();
        });
    }

    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'menu_promos');
    }
}
