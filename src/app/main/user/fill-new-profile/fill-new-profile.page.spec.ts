import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FillNewProfilePage } from './fill-new-profile.page';

describe('FillNewProfilePage', () => {
  let component: FillNewProfilePage;
  let fixture: ComponentFixture<FillNewProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillNewProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FillNewProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
