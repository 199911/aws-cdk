import { Template } from '../../assertions';
import * as logs from '../../aws-logs';
import * as cdk from '../../core';
import * as lambda from '../lib';

describe('logging Config', () => {
  test('Logging Config with LogGroup and no LogGroupName', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    const logGroup = new logs.LogGroup(stack, 'MyLogGroup');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      logGroup: logGroup,
    });
    // WHEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      LoggingConfig: {
        LogGroup: {
          Ref: 'MyLogGroup5C0DAD85',
        },
      },
    });
  });

  test('Logging Config with LogGroup', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
      logGroupName: 'customLogGroup',
    });
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      logGroup: logGroup,
    });
    // WHEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      LoggingConfig: {
        LogGroup: {
          Ref: 'MyLogGroup5C0DAD85',
        },
      },
    });
  });

  test('Logging Config TEXT logFormat', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      logFormat: lambda.LogFormat.TEXT,
    });
    // WHEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      LoggingConfig: {
        LogFormat: 'Text',
      },
    });
  });

  test('Logging Config JSON logFormat', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      logFormat: lambda.LogFormat.JSON,
    });
    // WHEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      LoggingConfig: {
        LogFormat: 'JSON',
      },
    });
  });

  test('Logging Config TEXT loggingFormat', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      loggingFormat: lambda.LoggingFormat.TEXT,
    });
    // WHEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      LoggingConfig: {
        LogFormat: 'Text',
      },
    });
  });

  test('Logging Config JSON loggingFormat', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      loggingFormat: lambda.LoggingFormat.JSON,
    });
    // WHEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      LoggingConfig: {
        LogFormat: 'JSON',
      },
    });
  });

  test('Logging Config with LogLevel set', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      logFormat: lambda.LogFormat.JSON,
      systemLogLevel: lambda.SystemLogLevel.INFO,
      applicationLogLevel: lambda.ApplicationLogLevel.INFO,
    });
    // WHEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      LoggingConfig: {
        LogFormat: 'JSON',
        SystemLogLevel: 'INFO',
        ApplicationLogLevel: 'INFO',
      },
    });
  });

  test('Logging Config with LogLevel set with enum keys', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      loggingFormat: lambda.LoggingFormat.JSON,
      systemLogLevelV2: lambda.SystemLogLevel.INFO,
      applicationLogLevelV2: lambda.ApplicationLogLevel.INFO,
    });
    // WHEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      LoggingConfig: {
        LogFormat: 'JSON',
        SystemLogLevel: 'INFO',
        ApplicationLogLevel: 'INFO',
      },
    });
  });

  test('Get function custom logGroup', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
      logGroupName: 'customLogGroup',
    });
    const lambdaFunction = new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      logGroup: logGroup,
    });
    expect(lambdaFunction.logGroup).toEqual(logGroup);
    expect(lambdaFunction.logGroup.logGroupName).toEqual(logGroup.logGroupName);
    expect(lambdaFunction.logGroup.logGroupPhysicalName()).toEqual(logGroup.logGroupPhysicalName());
  });

  test('Throws when logGroup and LogRention are set', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    expect(() => {
      new lambda.Function(stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        logRetention: logs.RetentionDays.INFINITE,
        logGroup: new logs.LogGroup(stack, 'MyLogGroup', {
          logGroupName: 'customLogGroup',
        }),
      });
    }).toThrow(/CDK does not support setting logRetention and logGroup/);
  });

  test('Throws when applicationLogLevel is specified with TEXT logFormat', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    expect(() => {
      new lambda.Function(stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        logFormat: lambda.LogFormat.TEXT,
        applicationLogLevel: lambda.ApplicationLogLevel.INFO,
      });
    }).toThrow(/To use ApplicationLogLevel and\/or SystemLogLevel you must set LogFormat to 'JSON', got 'Text'./);
  });

  test('Throws when systemLogLevel is specified with TEXT logFormat', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    expect(() => {
      new lambda.Function(stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        logFormat: lambda.LogFormat.TEXT,
        systemLogLevel: lambda.SystemLogLevel.INFO,
      });
    }).toThrow(/To use ApplicationLogLevel and\/or SystemLogLevel you must set LogFormat to 'JSON', got 'Text'./);
  });

  test('Throws when applicationLogLevel is specified with TEXT loggingFormat', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    expect(() => {
      new lambda.Function(stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        loggingFormat: lambda.LoggingFormat.TEXT,
        applicationLogLevel: lambda.ApplicationLogLevel.INFO,
      });
    }).toThrow(/To use ApplicationLogLevel and\/or SystemLogLevel you must set LoggingFormat to 'JSON', got 'Text'./);
  });

  test('Throws when applicationLogLevel is specified if logFormat is undefined', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    expect(() => {
      new lambda.Function(stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        applicationLogLevel: lambda.ApplicationLogLevel.INFO,
      });
    }).toThrow(/To use ApplicationLogLevel and\/or SystemLogLevel you must set LogFormat to 'JSON', got 'undefined'./);
  });

  test('Throws when systemLogLevel is specified if logFormat is undefined', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    expect(() => {
      new lambda.Function(stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        systemLogLevel: lambda.SystemLogLevel.INFO,
      });
    }).toThrow(/To use ApplicationLogLevel and\/or SystemLogLevel you must set LogFormat to 'JSON', got 'undefined'./);
  });

  test('Throws when loggingFormat and logFormat are both specified', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    expect(() => {
      new lambda.Function(stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        loggingFormat: lambda.LoggingFormat.JSON,
        logFormat: lambda.LogFormat.TEXT,
      });
    }).toThrow(/Only define LogFormat or LoggingFormat, not both./);
  });

  test('Throws when applicationLogLevel and applicationLogLevelV2 are both specified', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    expect(() => {
      new lambda.Function(stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        loggingFormat: lambda.LoggingFormat.JSON,
        applicationLogLevel: lambda.ApplicationLogLevel.INFO,
        applicationLogLevelV2: lambda.ApplicationLogLevel.WARN,
      });
    }).toThrow(/Only define applicationLogLevel or applicationLogLevelV2, not both./);
  });

  test('Throws when systemLogLevel and systemLogLevelV2 are both specified', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    expect(() => {
      new lambda.Function(stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        loggingFormat: lambda.LoggingFormat.JSON,
        systemLogLevel: lambda.SystemLogLevel.INFO,
        systemLogLevelV2: lambda.SystemLogLevel.WARN,
      });
    }).toThrow(/Only define systemLogLevel or systemLogLevelV2, not both./);
  });

  test('Throws when systemLogLevelV2 is specified if loggingFormat is undefined', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    expect(() => {
      new lambda.Function(stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        systemLogLevelV2: lambda.SystemLogLevel.INFO,
      });
    }).toThrow(/To use ApplicationLogLevel and\/or SystemLogLevel you must set LogFormat to 'JSON', got 'undefined'./);
  });

  test('Throws when applicationLogLevelV2 is specified if loggingFormat is undefined', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    expect(() => {
      new lambda.Function(stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        applicationLogLevelV2: lambda.ApplicationLogLevel.INFO,
      });
    }).toThrow(/To use ApplicationLogLevel and\/or SystemLogLevel you must set LogFormat to 'JSON', got 'undefined'./);
  });
});
