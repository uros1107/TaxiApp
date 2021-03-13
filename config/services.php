<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model' => App\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook' => [
            'secret' => env('STRIPE_WEBHOOK_SECRET'),
            'tolerance' => env('STRIPE_WEBHOOK_TOLERANCE', 300),
        ],
    ],

    'google' => [
        // 'client_id' => '326851312764-du2220m662p6jthiuqo7skqmit6cp1vp.apps.googleusercontent.com',
        // 'client_secret' => 'jhELKPIT1H6YG260xPz8gP8v',
        // 'redirect' => 'http://richard-test.com/google',
        'client_id' => '326851312764-r0nu1ubd6q43iiv9ql15svaoun7512n4.apps.googleusercontent.com',
        'client_secret' => 'qETiiYG5N2Z3awi8S7YDOgbV',
        'redirect' => 'https://mydcstaxi.com/google',
    ],

    'facebook' => [
        'client_id' => '2814723028774658',
        'client_secret' => 'c22fae8aeee0b16d25892d322f862308',
        'redirect' => 'https://mydcstaxi.com/facebook',
    ],

    'instagram' => [
        'client_id' => '2413553228947214',
        'client_secret' => '7ec0bfcde4d7d84ae5ad9faaab8efb0d',
        'token' => 'IGQVJWSE1sYmtEMXNWVDFFeXFCTndsSG1ZAcFJQVnNPRlpTanRZAMTFrdmFENGFacC1DeFRZAeEdDb2hjSHRvUjhKMVhZAanR2b1FQV3lDQnFsOFdZAZAGg4MDVta1dqTW43MHJuUmQ2a0R0TUNYcEpSc3FyLQZDZD',
        'redirect' => 'https://mydcstaxi.com/instagram',
    ],

    'twitter' => [
        'client_id' => 'f8KhJTnvQxeXoOEWaA9Jxc3dh',
        'client_secret' => 'gEV4RZ0KC8Gqtxwx13OQYmXlaGGcIQGtrQ5M4ubxG16hNPcrLZ',
        'redirect' => 'https://mydcstaxi.com/twitter',
    ],

    'youtube' => [
        'client_id' => '2814723028774658',
        'client_secret' => 'c22fae8aeee0b16d25892d322f862308',
        'redirect' => 'https://mydcstaxi.com/youtube',
    ],

    'linkedin' => [
        'code'=> '12314231',
        'client_id' => '86jtliyjpwkltm',
        'client_secret' => 'cPQ2cRP3sCaCcWJ7',
        'redirect' => 'https://mydcstaxi.com/linkedin',
    ],
];
