<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageSmokeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Every authenticated page must render without throwing an exception.
     */
    public function test_authenticated_pages_render_successfully(): void
    {
        $paths = [
            '/dashboard',
            '/pos',
            '/pos/tables',
            '/pos/kds',
            '/pos/inventory',
            '/pos/crm',
            '/pos/reports',
            '/profile',
        ];

        $user = User::factory()->create();

        foreach ($paths as $path) {
            $response = $this->actingAs($user)->get($path);

            $response->assertOk();
        }
    }

    public function test_authenticated_pages_require_login(): void
    {
        foreach (['/dashboard', '/pos', '/pos/tables', '/pos/kds', '/pos/inventory', '/pos/crm', '/pos/reports', '/profile'] as $path) {
            $this->get($path)->assertRedirect(route('login'));
        }
    }

    public function test_guest_visiting_root_is_redirected_to_login(): void
    {
        $this->get('/')->assertRedirect(route('login'));
    }

    public function test_authenticated_user_visiting_root_is_redirected_to_dashboard(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/')
            ->assertRedirect(route('dashboard'));
    }
}