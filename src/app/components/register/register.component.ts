import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';
import { CustomValidators } from 'src/app/confirm-password.validator';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide = true;
  error = null;
  user_id!: any;
  email!: string;
  
  registerForm = new FormGroup(
    {
      email: new FormControl({value: '', disabled: true}, [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),      
      confirm_password: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
    },
    [CustomValidators.MatchValidator('password', 'confirm_password')]
  );

  constructor(private rest: RestService, private router: Router, private dialog: MatDialog, public translate: TranslateService,
    private route: ActivatedRoute,private fb: FormBuilder) {
  }

  get passwordMatchError() {
    return (
      this.registerForm.getError('mismatch') &&
      this.registerForm.get('confirm_password')?.touched
    );
  }


  selectedValue: string = this.translate.currentLang


  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params["userid"] !== undefined) {
        this.rest.canRegis(params["userid"]).subscribe({
          next: (response) => {
            console.log(response)
            if(response.meta.response_code === 20000){
              this.email = response.meta.response_data.email
            }
          },
          error: (e) => console.error(e)
        });
      }
    });

  }

  async onSubmit() {
    let request = this.registerForm.value
    request['email'] = this.email
    console.log(request)
    this.rest.register(request).subscribe({
      next: (response) => {
        console.log(response)
        if (response.meta.response_code == 20000) {
          window.location.href = 'http://xten-technology.com/';        
        } else {
          alert('register failed')
        }
      },
      error: (e) => console.error(e)
    });
  }

  Languages: Languages[] = [
    { value: 'th', viewValue: 'ไทย' },
    { value: 'en', viewValue: 'English' },
  ];

  onSelectLanguage(value: any) {
    this.translate.use(value);
    console.log(HttpClient)
    console.log(this.translate.currentLang)
  }
}

interface Languages {
  value: string;
  viewValue: string;
}

