import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  constructor() {}

  print(content: string): void {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Document</title>
            <style>
              /* Add any custom styles here */
            </style>
          </head>
          <body>
            ${content}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
}
