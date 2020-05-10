import { CommonModule } from '@angular/common';
import { Component, NgModule, Output, EventEmitter } from '@angular/core';

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
}

async function eventToImageBase64(event: ClipboardEvent): Promise<string> {
  const imageItem = event.clipboardData.items[0];
  if (imageItem.kind === 'file' && imageItem.type === 'image/png')
    return await toBase64(imageItem.getAsFile())
}

@Component({
  selector: 'paste-image',
  template: `
  <input (paste)="paste($event)">
  `
})

export class PasteImageComponent {

  @Output() onPaste = new EventEmitter<string>()

  async paste(event: ClipboardEvent) {
    const image64 = await eventToImageBase64(event);
    if (image64) this.onPaste.emit(image64)
    // TODO: resize image (eg: max 720 before emit)
  }
}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [PasteImageComponent],
  exports: [PasteImageComponent],
})
export class PasteImageModule { }
