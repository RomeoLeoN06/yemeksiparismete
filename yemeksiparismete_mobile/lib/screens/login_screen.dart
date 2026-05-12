import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/auth_service.dart';
import 'register_screen.dart';
import 'home_screen.dart';
import 'admin_panel_screen.dart';
import 'restaurant_panel_screen.dart';
import 'courier_panel_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    // Otomatik yönlendirme: Eğer kullanıcı zaten giriş yapmışsa direkt ilgili ekrana git
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      if (authProvider.isAuthenticated && authProvider.user != null) {
        _redirectUser(authProvider.user!);
      }
    });
  }

  void _redirectUser(Map<String, dynamic> userData) {
    final role = (userData['role'] ?? userData['Role'] ?? 'customer').toString().toLowerCase();
    
    Widget nextScreen;
    switch (role) {
      case 'admin':
        nextScreen = const AdminPanelScreen();
        break;
      case 'restaurant_owner':
        nextScreen = const RestaurantPanelScreen();
        break;
      case 'courier':
        nextScreen = const CourierPanelScreen();
        break;
      default:
        nextScreen = const HomeScreen();
    }

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => nextScreen),
    );
  }

  void _login() async {
    if (_formKey.currentState!.validate()) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      
      final result = await authProvider.login(
        _identifierController.text.trim(),
        _passwordController.text,
      );

      if (!mounted) return;

      if (result['success']) {
        final userData = result['data']?['user'];
        _redirectUser(userData);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result['message'] ?? 'Giriş başarısız'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isLoading = context.watch<AuthProvider>().isLoading;

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Icon(
                    Icons.fastfood_rounded,
                    size: 80,
                    color: theme.colorScheme.primary,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Hoş Geldiniz',
                    style: theme.textTheme.displayLarge?.copyWith(fontSize: 32),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Devam etmek için giriş yapın',
                    style: theme.textTheme.bodyLarge?.copyWith(color: Colors.grey[600]),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 48),
                  
                  // Identifier (Email/Phone)
                  TextFormField(
                    controller: _identifierController,
                    decoration: InputDecoration(
                      labelText: 'E-posta veya Telefon',
                      prefixIcon: const Icon(Icons.person_outline),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      filled: true,
                      fillColor: theme.cardColor,
                    ),
                    validator: (value) => value!.isEmpty ? 'Bu alan boş bırakılamaz' : null,
                  ),
                  const SizedBox(height: 16),
                  
                  // Password
                  TextFormField(
                    controller: _passwordController,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: 'Şifre',
                      prefixIcon: const Icon(Icons.lock_outline),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      filled: true,
                      fillColor: theme.cardColor,
                    ),
                    validator: (value) => value!.isEmpty ? 'Şifre giriniz' : null,
                  ),
                  const SizedBox(height: 32),
                  
                  // Login Button
                  SizedBox(
                    height: 56,
                    child: ElevatedButton(
                      onPressed: isLoading ? null : _login,
                      style: ElevatedButton.styleFrom(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: isLoading
                          ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                          : const Text('Giriş Yap', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  
                  TextButton(
                    onPressed: _showForgotPasswordDialog,
                    child: const Text('Şifremi Unuttum', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('Hesabınız yok mu?'),
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const RegisterScreen()),
                          );
                        },
                        child: const Text('Kayıt Ol'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _showForgotPasswordDialog() {
    final emailController = TextEditingController();
    final codeController = TextEditingController();
    final newPassController = TextEditingController();
    bool isResetting = false;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          title: const Text('Şifre Yenileme', style: TextStyle(fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Hesap kurtarma kodunuzu girerek şifrenizi sıfırlayın.', style: TextStyle(fontSize: 13, color: Colors.grey)),
              const SizedBox(height: 20),
              TextField(
                controller: emailController,
                decoration: const InputDecoration(labelText: 'E-posta', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: codeController,
                decoration: const InputDecoration(labelText: 'Kurtarma Kodu (6 Hane)', border: OutlineInputBorder()),
                maxLength: 6,
                textCapitalization: TextCapitalization.characters,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: newPassController,
                obscureText: true,
                decoration: const InputDecoration(labelText: 'Yeni Şifre', border: OutlineInputBorder()),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('İptal')),
            ElevatedButton(
              onPressed: isResetting ? null : () async {
                if (emailController.text.isEmpty || codeController.text.isEmpty || newPassController.text.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Lütfen tüm alanları doldurun.')));
                  return;
                }
                
                final newPass = newPassController.text;
                if (newPass.length < 8 || !RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*()_+={}\[\]:;<>?/-])').hasMatch(newPass)) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Yeni şifre en az 8 karakter olmalı; büyük/küçük harf, rakam ve özel karakter içermelidir.')));
                  return;
                }
                setModalState(() => isResetting = true);
                final authService = AuthService();
                final result = await authService.resetPassword(
                  email: emailController.text.trim(),
                  recoveryCode: codeController.text.trim().toUpperCase(),
                  newPassword: newPassController.text,
                );
                setModalState(() => isResetting = false);

                if (result['success']) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Şifre başarıyla güncellendi!'), backgroundColor: Colors.green));
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result['message']), backgroundColor: Colors.red));
                }
              },
              child: isResetting ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)) : const Text('Sıfırla'),
            ),
          ],
        ),
      ),
    );
  }
}
