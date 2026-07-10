import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTurnstileComponent } from './ngx-turnstile.component';
import { TurnstileOptions } from './interfaces/turnstile-options';

describe('NgxTurnstileComponent', () => {
  let component: NgxTurnstileComponent;
  let fixture: ComponentFixture<NgxTurnstileComponent>;
  let renderedOptions: TurnstileOptions;

  beforeEach(async () => {
    // Stub the Turnstile script global before the component is constructed and
    // capture the options passed to turnstile.render().
    window.turnstile = {
      render: (_el: string | HTMLElement, options: TurnstileOptions) => {
        renderedOptions = options;
        return 'widget-id';
      },
      reset: () => {},
      getResponse: () => undefined,
      remove: () => {},
    };

    await TestBed.configureTestingModule({
      imports: [NgxTurnstileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxTurnstileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** Render with the currently-set inputs, pretending the script is loaded. */
  function render(): void {
    component.scriptLoaded.set(true);
    component.createWidget();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('maps camelCase inputs to Cloudflare wire keys', () => {
    component.siteKey = 'test-key';
    component.execution = 'execute';
    component.retryInterval = 5000;
    component.refreshExpired = 'manual';
    component.refreshTimeout = 'never';
    component.responseField = false;
    component.responseFieldName = 'my-token';
    component.feedbackEnabled = false;
    component.offlabelShowPrivacy = false;
    component.offlabelShowHelp = false;

    render();

    expect(renderedOptions.sitekey).toBe('test-key');
    expect(renderedOptions.execution).toBe('execute');
    expect(renderedOptions['retry-interval']).toBe(5000);
    expect(renderedOptions['refresh-expired']).toBe('manual');
    expect(renderedOptions['refresh-timeout']).toBe('never');
    expect(renderedOptions['response-field']).toBe(false);
    expect(renderedOptions['response-field-name']).toBe('my-token');
    expect(renderedOptions['feedback-enabled']).toBe(false);
    expect(renderedOptions['offlabel-show-privacy']).toBe(false);
    expect(renderedOptions['offlabel-show-help']).toBe(false);
  });

  it('omits optional parameters that are not set', () => {
    component.siteKey = 'test-key';

    render();

    expect('execution' in renderedOptions).toBe(false);
    expect('retry-interval' in renderedOptions).toBe(false);
    expect('refresh-expired' in renderedOptions).toBe(false);
    expect('response-field' in renderedOptions).toBe(false);
    expect('feedback-enabled' in renderedOptions).toBe(false);
  });

  it('emits lifecycle outputs when their callbacks fire', () => {
    component.siteKey = 'test-key';
    render();

    const emitted: string[] = [];
    component.beforeInteractive.subscribe(() => emitted.push('before'));
    component.afterInteractive.subscribe(() => emitted.push('after'));
    component.unsupported.subscribe(() => emitted.push('unsupported'));
    component.timeout.subscribe(() => emitted.push('timeout'));

    renderedOptions['before-interactive-callback']!();
    renderedOptions['after-interactive-callback']!();
    renderedOptions['unsupported-callback']!();
    renderedOptions['timeout-callback']!();

    expect(emitted).toEqual(['before', 'after', 'unsupported', 'timeout']);
  });
});
