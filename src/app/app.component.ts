import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from './services/rest.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from './confirm-password.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
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
    console.log(this.registerForm.value)
    // this.rest.register(value).subscribe({
    //   next: (response) => {
    //     console.log(response)
    //     if (response.meta.response_desc !== "") {
    //       this.router.navigate(['/dashboard']);
    //     } else {
    //       alert('register failed')
    //     }
    //   },
    //   error: (e) => console.error(e)
    // });
  }

  Languages: Languages[] = [
    { value: 'th', viewValue: 'ไทย' },
    { value: 'en', viewValue: 'English' },
  ];

  onSelectLanguage(value: any) {
    this.translate.use(value);
    console.log(this.translate.currentLang)
  }
}

interface Languages {
  value: string;
  viewValue: string;
}

function ConfirmPasswordValidator(arg0: string, arg1: string): any {
  throw new Error('Function not implemented.');
}
