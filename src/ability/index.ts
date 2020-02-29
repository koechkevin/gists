import { AbilityBuilder } from '@casl/ability';
import { JobsAction } from './jobs';

/**
 * Defines how to detect object's type: https://stalniy.github.io/casl/abilities/2017/07/20/define-abilities.html
 */
function subjectName(item: any) {
  if (!item || typeof item === 'string') {
    return item;
  }

  return item.__type;
}

export { JobsAction };

export default AbilityBuilder.define({ subjectName }, (can: any) => {
  can(
    [JobsAction.Create, JobsAction.View, JobsAction.Update, JobsAction.Delete, JobsAction.UpdateAny, JobsAction.GetAny],
    'Job'
  );
});
