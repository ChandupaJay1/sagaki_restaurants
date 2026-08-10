<?php

namespace Tests\Feature\Auth;

use App\Auth\HardcodedUserProvider;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $response = $this->post('/login', [
            'email' => HardcodedUserProvider::EMAIL,
            'password' => HardcodedUserProvider::PASSWORD,
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $this->post('/login', [
            'email' => HardcodedUserProvider::EMAIL,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_not_authenticate_with_unknown_email(): void
    {
        $this->post('/login', [
            'email' => 'nobody@example.com',
            'password' => HardcodedUserProvider::PASSWORD,
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $response = $this->actingAs(HardcodedUserProvider::user())->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/login');
    }
}