<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location')->nullable();
            $table->string('contact')->nullable();
            $table->timestamps();
        });

        Schema::create('tables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            $table->string('name');
            $table->string('type'); // e.g. 2-top, 4-top, patio-4, bar
            $table->integer('seats');
            $table->string('status')->default('available'); // available, occupied, reserved
            $table->string('customer')->nullable();
            $table->decimal('bill', 12, 2)->default(0);
            $table->string('started_at')->nullable(); // e.g. "18:30"
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->string('icon')->nullable(); // e.g. utensils, flame, chef-hat
            $table->timestamps();
        });

        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->string('emoji')->nullable();
            $table->json('tags')->nullable(); // e.g. ['spicy', 'vegan']
            $table->boolean('is_available')->default(true);
            $table->string('barcode')->nullable();
            $table->timestamps();
        });

        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            $table->string('name');
            $table->string('category'); // e.g. proteins, produce, dairy, spices, beverages, seafood
            $table->decimal('qty', 10, 2)->default(0);
            $table->string('unit'); // e.g. kg, pcs, bags, tins, liters, bundles
            $table->decimal('min_qty', 10, 2)->default(0);
            $table->decimal('price', 10, 2)->default(0); // Unit price
            $table->string('supplier')->nullable();
            $table->date('last_order')->nullable();
            $table->string('status')->default('ok'); // ok, low, critical
            $table->timestamps();
        });

        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_item_id')->constrained('menu_items')->onDelete('cascade');
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->onDelete('cascade');
            $table->decimal('qty_required', 10, 3); // e.g. 0.200 (for 200g) or 2.000 (for 2 pieces)
            $table->timestamps();
        });

        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->integer('visits')->default(0);
            $table->decimal('total_spend', 12, 2)->default(0);
            $table->string('tier')->default('bronze'); // bronze, silver, gold
            $table->text('notes')->nullable();
            $table->integer('loyalty_points')->default(0);
            $table->string('favorite')->nullable();
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. ORD-142, KDS-001
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('set null');
            $table->foreignId('table_id')->nullable()->constrained('tables')->onDelete('set null');
            $table->foreignId('customer_id')->nullable()->constrained('customers')->onDelete('set null');
            $table->string('order_type')->default('dine-in'); // dine-in, takeaway, delivery
            $table->string('status')->default('new'); // new, preparing, ready, served, paid, cancelled
            $table->string('payment_method')->nullable(); // Cash, Card, QR
            $table->text('note')->nullable();
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('service_charge', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->foreignId('cashier_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->string('order_id');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreignId('menu_item_id')->constrained('menu_items')->onDelete('cascade');
            $table->integer('qty');
            $table->decimal('price', 10, 2);
            $table->json('options')->nullable(); // options or notes for KDS
            $table->timestamps();
        });

        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->string('supplier');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('status')->default('pending'); // pending, received
            $table->string('payment_status')->default('unpaid'); // unpaid, paid, partially-paid
            $table->timestamps();
        });

        Schema::create('purchase_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_id')->constrained('purchases')->onDelete('cascade');
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->onDelete('cascade');
            $table->decimal('qty', 10, 2);
            $table->decimal('unit_price', 10, 2);
            $table->timestamps();
        });

        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->string('order_id');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->string('rider_name')->nullable();
            $table->decimal('delivery_charge', 10, 2)->default(0);
            $table->string('status')->default('assigned'); // assigned, transit, delivered
            $table->timestamps();
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            $table->string('category'); // utilities, rent, salaries, inventory, marketing, other
            $table->decimal('amount', 10, 2);
            $table->string('description')->nullable();
            $table->date('date');
            $table->timestamps();
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('action');
            $table->text('details')->nullable();
            $table->timestamps();
        });

        Schema::create('attendance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('date');
            $table->time('clock_in')->nullable();
            $table->time('clock_out')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('deliveries');
        Schema::dropIfExists('purchase_items');
        Schema::dropIfExists('purchases');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('recipes');
        Schema::dropIfExists('inventory_items');
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('tables');
        Schema::dropIfExists('branches');
    }
};
