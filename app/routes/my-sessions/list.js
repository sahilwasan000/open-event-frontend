import Route from '@ember/routing/route';
import moment from 'moment';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  titleToken() {
    switch (this.get('params.session_status')) {
      case 'upcoming':
        return this.get('l10n').t('Upcoming');
      case 'past':
        return this.get('l10n').t('Past');
    }
  },
  model(params) {
    this.set('params', params);
    let filterOptions = [];
    if (params.session_status === 'upcoming') {
      filterOptions = [
        {
          or: [
            {
              name : 'starts-at',
              op   : 'ge',
              val  : moment().toISOString()
            },
            {
              and: [
                {
                  name : 'starts-at',
                  op   : 'eq',
                  val  : null
                },
                {
                  name : 'ends-at',
                  op   : 'eq',
                  val  : null
                }
              ]
            }
          ]
        }
      ];
    } else {
      filterOptions = [
        {
          name : 'ends-at',
          op   : 'lt',
          val  : moment().toISOString()
        }
      ];
    }
    return this.get('authManager.currentUser').query('sessions', {
      include : 'event',
      filter  : filterOptions,
      sort    : 'starts-at'
    });
  }
});
