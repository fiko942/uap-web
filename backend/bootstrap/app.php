<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // No custom middleware aliases - keep it simple
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Simple API error responses in Indonesian
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => 'tidak_login',
                    'pesan' => 'Silakan login terlebih dahulu untuk mengakses fitur ini.'
                ], 401);
            }
        });

        $exceptions->render(function (\Illuminate\Auth\Access\AuthorizationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => 'ditolak',
                    'pesan' => 'Anda tidak memiliki izin untuk mengakses fitur ini.'
                ], 403);
            }
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => 'gagal',
                    'pesan' => 'Data yang Anda cari tidak ditemukan.'
                ], 404);
            }
        });
    })->create();
