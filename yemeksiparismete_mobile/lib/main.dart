import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/cart_provider.dart';
import 'providers/location_provider.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => LocationProvider()),
      ],
      child: const YemeksiparisApp(),
    ),
  );
}

class YemeksiparisApp extends StatelessWidget {
  const YemeksiparisApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Yemek Siparişi',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFF050505), // --bg-main
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFFF7E00), // --primary
          primary: const Color(0xFFFF7E00),
          secondary: const Color(0x14FF7E00), // --accent
          background: const Color(0xFF050505),
          surface: const Color(0xFF111111), // --bg-card
          brightness: Brightness.dark,
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(
          ThemeData(brightness: Brightness.dark).textTheme,
        ).copyWith(
          bodyLarge: GoogleFonts.plusJakartaSans(color: const Color(0xFFFFFFFF)), // --text-main
          bodyMedium: GoogleFonts.plusJakartaSans(color: const Color(0xFFFFFFFF)),
          displayLarge: GoogleFonts.outfit(color: const Color(0xFFFFFFFF), fontWeight: FontWeight.bold),
          displayMedium: GoogleFonts.outfit(color: const Color(0xFFFFFFFF), fontWeight: FontWeight.bold),
          titleLarge: GoogleFonts.outfit(color: const Color(0xFFFFFFFF), fontWeight: FontWeight.bold),
          titleMedium: GoogleFonts.outfit(color: const Color(0xFFFFFFFF)),
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: const Color(0xFF050505),
          foregroundColor: const Color(0xFFFFFFFF),
          elevation: 0,
          centerTitle: true,
          titleTextStyle: GoogleFonts.outfit(
            color: const Color(0xFFFFFFFF),
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFFF7E00),
            foregroundColor: const Color(0xFF000000),
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20), // --radius-md
            ),
            textStyle: GoogleFonts.outfit(
              fontWeight: FontWeight.w900,
              letterSpacing: 2,
            ),
            elevation: 8,
            shadowColor: const Color(0x40FF7E00), // --orange-glow
          ),
        ),
        cardTheme: CardTheme(
          color: const Color(0xFF111111),
          elevation: 10,
          shadowColor: const Color(0x99000000), // --shadow-lux
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(32), // --radius-lg
            side: const BorderSide(color: Color(0x0DFFFFFF)), // --border-light
          ),
        ),
      ),
      home: const LoginScreen(),
    );
  }
}

