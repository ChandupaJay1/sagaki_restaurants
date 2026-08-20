<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MenuItem::with('category');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->boolean('available_only')) {
            $query->where('is_available', true);
        }

        $items = $query->orderBy('name')->get();

        return response()->json($items);
    }

    public function show(MenuItem $menuItem): JsonResponse
    {
        $menuItem->load('category');

        return response()->json($menuItem);
    }

    public function categories(): JsonResponse
    {
        $categories = \App\Models\Category::orderBy('name')->get();

        return response()->json($categories);
    }
}
