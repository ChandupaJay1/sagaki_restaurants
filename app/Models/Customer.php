<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $fillable = ['name', 'phone', 'email', 'visits', 'total_spend', 'tier', 'notes', 'loyalty_points', 'favorite'];

    protected $casts = [
        'total_spend' => 'decimal:2',
        'visits' => 'integer',
        'loyalty_points' => 'integer',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
