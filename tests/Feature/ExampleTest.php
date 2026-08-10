<?php

namespace Tests\Feature;

use App\Auth\HardcodedUserProvider;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * The root URL redirects guests to the authentication screen.
     */
    public function test_the_application_redirects_guests_to_login(): void
    {
        $response = $this->get('/');

        $response->assertRedirect(route('login'));
    }

    public function test_the_disclaimer_page_is_not_required(): void
    {
        $this->actingAs(HardcodedUserProvider::user())->get('/')->assertRedirect(route('dashboard'));
    }
}