import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../services/api_constants.dart';

class CourierApplicationScreen extends StatefulWidget {
  const CourierApplicationScreen({super.key});

  @override
  State<CourierApplicationScreen> createState() => _CourierApplicationScreenState();
}

class _CourierApplicationScreenState extends State<CourierApplicationScreen> {
  final _formKey = GlobalKey<FormState>();
  
  String _fullName = '';
  String _email = '';
  String _phone = '';
  String _city = '';
  String _district = '';
  String _vehicleType = 'Motorcycle';
  String _driverLicenseType = 'A2';
  String _experienceInfo = '';
  bool _isSubmitting = false;

  Future<void> _submitApplication() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    setState(() => _isSubmitting = true);

    try {
      final response = await http.post(
        Uri.parse('${ApiConstants.couriers}/apply'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'fullName': _fullName,
          'email': _email,
          'phoneNumber': _phone,
          'city': _city,
          'district': _district,
          'vehicleType': _vehicleType,
          'driverLicenseType': _driverLicenseType,
          'experienceInfo': _experienceInfo,
        }),
      );

      if (mounted) {
        setState(() => _isSubmitting = false);
        if (response.statusCode == 200) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (context) => AlertDialog(
              title: const Text('Başarılı!'),
              content: const Text('Kurye başvurunuz alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.'),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(context); // Close dialog
                    Navigator.pop(context); // Go back to profile
                  },
                  child: const Text('Tamam'),
                )
              ],
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Başvuru gönderilirken bir hata oluştu.'), backgroundColor: Colors.red));
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSubmitting = false);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Hata: $e'), backgroundColor: Colors.red));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Kurye Ol')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(Icons.delivery_dining, size: 80, color: Colors.orange),
              const SizedBox(height: 16),
              const Text('Ekibimize Katılın!', textAlign: TextAlign.center, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              const Text('Hemen başvurunuzu yapın, değerlendirip size dönelim.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey)),
              const SizedBox(height: 32),
              
              TextFormField(
                decoration: const InputDecoration(labelText: 'Ad Soyad', border: OutlineInputBorder()),
                validator: (v) => v!.isEmpty ? 'Zorunlu' : null,
                onSaved: (v) => _fullName = v!,
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(labelText: 'E-Posta', border: OutlineInputBorder()),
                keyboardType: TextInputType.emailAddress,
                validator: (v) => v!.isEmpty || !v.contains('@') ? 'Geçerli bir e-posta girin' : null,
                onSaved: (v) => _email = v!,
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Telefon Numarası', border: OutlineInputBorder()),
                keyboardType: TextInputType.phone,
                validator: (v) => v!.isEmpty ? 'Zorunlu' : null,
                onSaved: (v) => _phone = v!,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      decoration: const InputDecoration(labelText: 'İl', border: OutlineInputBorder()),
                      validator: (v) => v!.isEmpty ? 'Zorunlu' : null,
                      onSaved: (v) => _city = v!,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      decoration: const InputDecoration(labelText: 'İlçe', border: OutlineInputBorder()),
                      validator: (v) => v!.isEmpty ? 'Zorunlu' : null,
                      onSaved: (v) => _district = v!,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(labelText: 'Araç Türü', border: OutlineInputBorder()),
                value: _vehicleType,
                items: ['Motorcycle', 'Car', 'Bicycle', 'Scooter'].map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                onChanged: (v) => setState(() => _vehicleType = v!),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(labelText: 'Ehliyet Tipi', border: OutlineInputBorder()),
                value: _driverLicenseType,
                items: ['A1', 'A2', 'B', 'None'].map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                onChanged: (v) => setState(() => _driverLicenseType = v!),
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Deneyim Bilgisi (Opsiyonel)', border: OutlineInputBorder()),
                maxLines: 3,
                onSaved: (v) => _experienceInfo = v ?? '',
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _isSubmitting ? null : _submitApplication,
                style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                child: _isSubmitting ? const CircularProgressIndicator(color: Colors.white) : const Text('Başvuruyu Tamamla', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
