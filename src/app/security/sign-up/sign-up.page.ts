import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/core/services/alert.service';
import { IdentityService } from 'src/app/core/services/identity.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  currentSection: number = 1;
  signUpForm!: FormGroup;

  constructor(
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
    private navController: NavController) {
  }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.signUpForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  goToSection(section: number) {
    this.currentSection = section;  // Cambia a la sección indicada
  }

  createUser() {
    this.identityService.signUp(this.signUpForm.value).subscribe({
      next: (data) => {
        console.log(data);
        this.navController.navigateBack('/security/sign-in');
        this.alertService.success('Congrats!', 'User created succesfully')
      }
    })
  }


}