import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StartRecordingPage } from './start-recording.page';

describe('StartRecordingPage', () => {
  let component: StartRecordingPage;
  let fixture: ComponentFixture<StartRecordingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartRecordingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StartRecordingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
