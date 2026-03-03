import 'package:flutter/material.dart';
import 'package:agendly_app/config/helpers/responsive.dart';

/// EJEMPLOS DE USO DE LA CLASE RESPONSIVE
/// Este archivo muestra diferentes formas de usar Responsive en tu aplicación

class ResponsiveUsageExample extends StatelessWidget {
  const ResponsiveUsageExample({super.key});

  @override
  Widget build(BuildContext context) {
    // ==================== FORMA 1: Usando la instancia ====================
    final responsive = Responsive.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ejemplos de Responsive'),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(responsive.iScreen(2)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ==================== EJEMPLO 1: Contenedor con dimensiones responsivas ====================
            Container(
              width: responsive.wScreen(90),
              height: responsive.hScreen(20),
              color: Colors.blue,
              child: Center(
                child: Text(
                  'Contenedor Responsivo',
                  style: TextStyle(
                    fontSize: responsive.iScreen(1.6),
                    color: Colors.white,
                  ),
                ),
              ),
            ),

            SizedBox(height: responsive.hScreen(2)),

            // ==================== EJEMPLO 2: Dimensiones con wScreen/hScreen ====================
            Container(
              width: responsive.wScreen(80),
              height: responsive.hScreen(15),
              color: Colors.green,
              child: Center(
                child: Text(
                  'Usando wScreen/hScreen',
                  style: TextStyle(
                    fontSize: responsive.iScreen(1.4),
                    color: Colors.white,
                  ),
                ),
              ),
            ),

            SizedBox(height: responsive.hScreen(2)),

            // ==================== EJEMPLO 3: Adaptación por tamaño de pantalla ====================
            Container(
              width: responsive.wScreen(100),
              padding: responsive.width >= 600
                  ? const EdgeInsets.all(16)
                  : responsive.width < 360
                      ? const EdgeInsets.all(4)
                      : const EdgeInsets.all(8),
              color: Colors.orange,
              child: Text(
                responsive.width >= 600
                    ? 'Esto es una Tablet'
                    : responsive.width < 360
                        ? 'Teléfono Pequeño'
                        : 'Teléfono Normal',
                style: TextStyle(
                  fontSize: responsive.iScreen(1.4),
                  color: Colors.white,
                ),
              ),
            ),

            SizedBox(height: responsive.hScreen(2)),

            // ==================== EJEMPLO 4: Grid responsivo ====================
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: responsive.width >= 600 ? 4 : 2,
                crossAxisSpacing: responsive.wScreen(2),
                mainAxisSpacing: responsive.hScreen(1),
                childAspectRatio: 1,
              ),
              itemCount: 6,
              itemBuilder: (context, index) {
                return Container(
                  decoration: BoxDecoration(
                    color: Colors.purple,
                    borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                  ),
                  child: Center(
                    child: Text(
                      'Item ${index + 1}',
                      style: TextStyle(
                        fontSize: responsive.iScreen(1.2),
                        color: Colors.white,
                      ),
                    ),
                  ),
                );
              },
            ),

            SizedBox(height: responsive.hScreen(2)),

            // ==================== EJEMPLO 5: Información del dispositivo ====================
            Card(
              child: Padding(
                padding: EdgeInsets.all(responsive.iScreen(2)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Información del Dispositivo',
                      style: TextStyle(
                        fontSize: responsive.iScreen(1.6),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: responsive.hScreen(1)),
                    _buildInfoRow('Ancho', '${responsive.width.toStringAsFixed(2)} px', responsive),
                    _buildInfoRow('Alto', '${responsive.height.toStringAsFixed(2)} px', responsive),
                    _buildInfoRow('Diagonal', '${responsive.inch.toStringAsFixed(2)} px', responsive),
                    _buildInfoRow('Aspect Ratio', (responsive.width / responsive.height).toStringAsFixed(2), responsive),
                    _buildInfoRow('Orientación', responsive.height > responsive.width ? 'Vertical' : 'Horizontal', responsive),
                    _buildInfoRow('Tipo', responsive.width >= 600 ? 'Tablet' : 'Teléfono', responsive),
                  ],
                ),
              ),
            ),

            SizedBox(height: responsive.hScreen(2)),

            // ==================== EJEMPLO 6: Botones responsivos ====================
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildResponsiveButton(
                  context,
                  'Pequeño',
                  Colors.red,
                  responsive.wScreen(25),
                  responsive.hScreen(5),
                  responsive,
                ),
                _buildResponsiveButton(
                  context,
                  'Mediano',
                  Colors.blue,
                  responsive.wScreen(30),
                  responsive.hScreen(6),
                  responsive,
                ),
                _buildResponsiveButton(
                  context,
                  'Grande',
                  Colors.green,
                  responsive.wScreen(35),
                  responsive.hScreen(7),
                  responsive,
                ),
              ],
            ),

            SizedBox(height: responsive.hScreen(3)),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, Responsive responsive) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: responsive.hScreen(0.5)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(fontSize: responsive.iScreen(1.2)),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: responsive.iScreen(1.2),
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResponsiveButton(
    BuildContext context,
    String text,
    Color color,
    double width,
    double height,
    Responsive responsive,
  ) {
    return ElevatedButton(
      onPressed: () {},
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        minimumSize: Size(width, height),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(responsive.iScreen(1)),
        ),
      ),
      child: Text(
        text,
        style: TextStyle(fontSize: responsive.iScreen(1.2)),
      ),
    );
  }
}
