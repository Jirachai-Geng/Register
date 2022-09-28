import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user = new UntypedFormControl('', [Validators.required]);
  hide = true;
  error = null;

  static user_info: any;

  constructor(private rest: RestService, private router: Router,private dialog: MatDialog, public translate: TranslateService) { 
  }

  getErrorMessage(){
    if (this.user.hasError('required')? 'Not a valid email' : '') {
      return 'You must enter a value';
    }
    return null
  }
  openDialog(element: any) {
    // const dialogRef = this.dialog.open(AuthErrorComponent, {data: {result: element}, disableClose: true});
    // dialogRef.afterClosed().subscribe((result) => {
    // });
  }
  
  async onSubmit(value: any) {
    this.rest.login(value).subscribe({
      next: (response) => {
        console.log(response)
        if (response.meta.response_desc !== ""){
          localStorage.setItem("access_token", response.meta.response_data.token)
          localStorage.setItem("user_info", JSON.stringify(response.meta.response_data.user_info));
          console.log(response.meta.response_data.user_info.rule )
          if (response.meta.response_data.user_info.rule === 'User'){
            this.router.navigate(['/report-tou']);
          }
          else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          alert('login failed')
        }
      },
      error: (e) => console.error(e)
    });
  }

  selectedValue: string = this.translate.currentLang

  Languages: Languages[] = [
    {value: 'th', viewValue: 'ไทย'},
    {value: 'en', viewValue: 'English'},
  ];

  ngOnInit(): void {
  }

  onSelectLanguage(value: any){
    this.translate.use(value);
    console.log(this.translate.currentLang)
  }

}

interface Languages {
  value: string;
  viewValue: string;
}
