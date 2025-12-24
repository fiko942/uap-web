<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Str;

class Menu extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'image_path',
        'stock',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];

    protected static function booted()
    {
        static::creating(function ($menu) {
            $menu->slug = Str::slug($menu->name);
        });

        static::updating(function ($menu) {
            if ($menu->isDirty('name')) {
                $menu->slug = Str::slug($menu->name);
            }
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function promos()
    {
        return $this->belongsToMany(Promo::class, 'menu_promos');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if ($this->image_path) {
            return \Illuminate\Support\Facades\Storage::url($this->image_path);
        }
        return null; // Or default image URL
    }
}
