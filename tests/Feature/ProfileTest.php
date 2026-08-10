<?php

namespace Tests\Feature;

use App\Auth\HardcodedUserProvider;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    public function test_profile_page_is_displayed(): void
    {
        $response = $this
            ->actingAs(HardcodedUserProvider::user())
            ->get('/profile');

        $response->assertOk();
        $response->assertSee('Administrator');
    }

    public function test_profile_page_requires_authentication(): void
    {
        $this->get('/profile')->assertRedirect(route('login'));
    }
}