import { Pipe, PipeTransform } from '@angular/core';
import { Stages } from 'src/app/models/stages';

@Pipe({
  name: 'stageName'
})
export class StageNamePipe implements PipeTransform {

  transform(stage: Stages): string {
    if (stage === Stages.Login) {
      return 'Login';
    }
    if (stage === Stages.AccessCard) {
      return 'Adgangskort';
    }
    if (stage === Stages.Snake) {
      return 'Snake';
    }
    if (stage === Stages.Memory) {
      return 'Kort';
    }
    if (stage === Stages.Autocode) {
      return 'Kode';
    }
    if (stage === Stages.FindQrCode) {
      return 'QR';
    }
    if (stage === Stages.End) {
      return 'Slutt';
    }
    return 'Ukjent';
  }

}
