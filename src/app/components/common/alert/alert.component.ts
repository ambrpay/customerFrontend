import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { Subscription } from 'rxjs/Subscription';
import { Alert, AlertType } from '../../../models/alert';



@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit {
  alerts: Alert[] = [];

  constructor(private alertService: AlertService) { }

  ngOnInit() {
      this.alertService.getAlert().subscribe((alert: Alert) => {
          console.log(alert);
          if (!alert) {
              this.alerts = [];
              return;
          }

          this.alerts.push(alert);
          setTimeout(() => {
            this.removeAlert(alert);
          },  10000);
      });
  }

  removeAlert(alert: Alert) {
      this.alerts = this.alerts.filter(x => x !== alert);
  }

  cssClass(alert: Alert) {
      if (!alert) {
          return;
      }

      // return css class based on alert type
      switch (alert.type) {
          case AlertType.Success:
              return 'toast-success';
          case AlertType.Error:
              return 'toast-error';
          case AlertType.Info:
              return 'toast-info';
          case AlertType.Warning:
              return 'toast-warning';
      }
  }
}
