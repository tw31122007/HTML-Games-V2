class State 
{
    constructor(variables,run,checks,edges)
    {
        this.variables = variables;
        this.checks = checks;
        this.edges = edges;
        this.run =  run;
    }

    check()
    {
        for (i = 0; i < this.checks.Length(); ++i)
        {
            if (this.checks[i]())
            {
                return this.edges[i];
            }
        }
        return false;
    }

    variables(entity)
    {
        for (i = 0; i < this.variables.Length(); ++i)
        {
            this.variables[i](entity);
        }
    }
}




class StateMachine 
{ 
    constructor(entity, states)
    {
        this.entity = entity;
        this.base = states[0];
        this.goto(1);
    }

    goto(l)
    {
        this.current = states[l];
        this.current.variables(entity);
    }

    update(dt, frameCount) 
    {   
        check = this.current.check();
        if (check != false)
        {
            this.goto(check);
        }
        this.current.run(dt, frameCount);	
        this.base.run(dt, frameCount);
	}
}