<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    protected $fillable = ['branch_id', 'name', 'category', 'qty', 'unit', 'min_qty', 'price', 'supplier', 'last_order', 'status'];

    protected $casts = [
        'qty' => 'decimal:2',
        'min_qty' => 'decimal:2',
        'price' => 'decimal:2',
        'last_order' => 'date',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function recipes(): HasMany
    {
        return $this->hasMany(Recipe::class);
    }
}
