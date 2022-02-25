interface Range {
  start: number;
  end: number;
}

export interface OperatorPlannerGoal {
  operatorId: string;
  elite?: Range;
  skillLevel?: Range;
  masteries?: {
    [skillNumber: number]: Range;
  };
}
