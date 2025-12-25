<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Struk Pesanan - {{ $order->uuid }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
        }

        .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 10px;
            color: #666;
        }

        .info-section {
            margin-bottom: 20px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .info-label {
            font-weight: bold;
            width: 150px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        th {
            background-color: #f0f0f0;
            padding: 10px;
            text-align: left;
            font-weight: bold;
            border-bottom: 2px solid #000;
        }

        td {
            padding: 8px 10px;
            border-bottom: 1px solid #ddd;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .totals {
            margin-top: 20px;
            border-top: 2px solid #000;
            padding-top: 15px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 13px;
        }

        .total-row.grand {
            font-size: 16px;
            font-weight: bold;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #000;
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px dashed #000;
            font-size: 11px;
        }

        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 5px;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
        }

        .status-diproses {
            background-color: #fef3c7;
            color: #92400e;
        }

        .status-dibayar {
            background-color: #dbeafe;
            color: #1e40af;
        }

        .status-selesai {
            background-color: #d1fae5;
            color: #065f46;
        }

        .status-dibatalkan {
            background-color: #fee2e2;
            color: #991b1b;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>GOLDEN DRAGON WOK</h1>
        <p>Restoran Masakan Oriental Autentik</p>
        <p>Jl. Raya Donomulyo No. 123, Donomulyo, Malang, Jawa Timur</p>
        <p>Email: tobellord@gmail.com</p>
    </div>

    <div class="info-section">
        <div class="info-row">
            <span class="info-label">Nomor Pesanan:</span>
            <span><strong>{{ strtoupper(substr($order->uuid, 0, 8)) }}</strong></span>
        </div>
        <div class="info-row">
            <span class="info-label">Tanggal/Waktu:</span>
            <span>{{ $order->created_at->format('d/m/Y H:i') }} WIB</span>
        </div>
        <div class="info-row">
            <span class="info-label">Pelanggan:</span>
            <span>{{ $order->user ? $order->user->name : 'Guest/Terhapus' }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="status-badge status-{{ $order->status }}">{{ ucfirst($order->status) }}</span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 50%;">Menu</th>
                <th class="text-center" style="width: 10%;">Qty</th>
                <th class="text-right" style="width: 20%;">Harga</th>
                <th class="text-right" style="width: 20%;">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->orderItems as $item)
                <tr>
                    <td>{{ $item->menu ? $item->menu->name : 'Item Tidak Tersedia' }}</td>
                    <td class="text-center">{{ $item->qty }}</td>
                    <td class="text-right">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($item->line_total, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <div class="total-row">
            <span>Subtotal:</span>
            <span>Rp {{ number_format($order->subtotal, 0, ',', '.') }}</span>
        </div>
        <div class="total-row">
            <span>Diskon:</span>
            <span>- Rp {{ number_format($order->discount_total, 0, ',', '.') }}</span>
        </div>
        <div class="total-row grand">
            <span>TOTAL BAYAR:</span>
            <span>Rp {{ number_format($order->grand_total, 0, ',', '.') }}</span>
        </div>
    </div>

    <div class="footer">
        <p><strong>Kasir: {{ $kasir }}</strong></p>
        <p style="margin-top: 15px;">Terima kasih atas kunjungan Anda!</p>
        <p>Selamat menikmati hidangan kami</p>
        <p style="margin-top: 10px; font-size: 10px; color: #999;">
            © {{ now()->format('Y') }} WIJI FIKO TEREN - Struk dicetak pada {{ now()->format('d/m/Y H:i') }} WIB
        </p>
    </div>
</body>

</html>