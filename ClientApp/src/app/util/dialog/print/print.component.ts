import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent {
  constructor(
    public dialogRef: MatDialogRef<PrintComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { heading: string; lines: string[] }
  ) {}

  onPrint(): void {
    const content = `
      <h1>${this.data.heading}</h1>
      ${this.data.lines.map(line => `<p>${line}</p>`).join('')}
    `;

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
    this.dialogRef.close();
  }
}
