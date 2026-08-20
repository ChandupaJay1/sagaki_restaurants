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
        $query = MenuItem::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->boolean('available_only')) {
            $query->where('is_available', true);
        }

        $items = $query->orderBy('category')->orderBy('name')->get();

        return response()->json($items);
    }

    public function show(MenuItem $menuItem): JsonResponse
    {
        return response()->json($menuItem);
    }

    public function categories(): JsonResponse
    {
        $categories = MenuItem::distinct()
            ->pluck('category')
            ->sort()
            ->values();

        return response()->json($categories);
    }
}
