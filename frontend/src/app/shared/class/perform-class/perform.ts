import { Observable } from "rxjs";
import { catchError, take } from "rxjs/operators";

export class Perform<T> {
    data: T | undefined;
    isLoading: boolean = false;
    hasError: boolean = false; //yang tiga ini adalah hasil variable, yang bawah adalah aksi yag dilakukan
    private action$:Observable<T> | undefined; //observe hasil dari T dari data

    load(action$ : Observable<T>): void{ //jadi disini saat method jalan, maka variable akan berubah
        this.isLoading = true;
        this.hasError = false;
        this.action$ = action$; //jalankan aksi , gitu?
        this.action$
        .pipe(
            take(1),
            catchError(() => {
                this.data = undefined;
                this.isLoading = false;
                this.hasError = true;
                return [];
        })
    ).subscribe((data: any) => {
        this.data = data;
        this.isLoading = false;
        this.hasError = false;
    })
    }

}
