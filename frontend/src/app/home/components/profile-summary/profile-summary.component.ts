import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileTypeResult, fromBuffer } from 'file-type/core';
import { BehaviorSubject, from, of, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Role, User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BannerColorService } from '../../services/banner-color.service';

type ValidFileExtension = 'png' | 'jpeg' | 'jpg';
type ValidMimeType = 'image/png' | 'image/jpeg' | 'image/jpg';

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent implements OnInit, OnDestroy {
  form: FormGroup;

  validFileExtensions: ValidFileExtension[] = ['png', 'jpeg', 'jpg'];
  validMimeTypes: ValidMimeType[] = ['image/png', 'image/jpeg', 'image/jpg'];

  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  private userSubscription: Subscription;

  constructor(
    private authService: AuthService,
    public bannerColorService: BannerColorService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      file: new FormControl(null),
    });

    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });

    this.userSubscription = this.authService.userStream.subscribe(
      (user: User) => {
        if (user?.role) {
          this.bannerColorService.bannerColors =
            this.bannerColorService.getBannerColors(user.role);
        }
        if (user && user?.firstName && user?.lastName) {
          this.fullName = user.firstName + ' ' + user.lastName;
          this.fullName$.next(this.fullName);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.userImagePathSubscription.unsubscribe();
  }

  onFileSelect(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    from(file.arrayBuffer())
      .pipe(
        switchMap((buffer: Buffer) =>
          from(fromBuffer(buffer)).pipe(
            switchMap((fileTypeResult: FileTypeResult) => {
              if (!fileTypeResult) {
                // TODO: error handling
                console.log({ error: 'file format not supported!' });
                return of();
              }
              const { ext, mime } = fileTypeResult;
              const isFileTypeLegit = this.validFileExtensions.includes(
                ext as any
              );
              const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
              const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
              if (!isFileLegit) {
                console.log({
                  error: 'file format does not amtch file extension!',
                });
                return of();
              }
              return this.authService.uploadUserImage(formData);
            })
          )
        )
      )
      .subscribe();

    this.form.reset();
  }
}
