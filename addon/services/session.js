import Ember from 'ember';

const { inspect, isBlank, isPresent } = Ember;

export default Ember.Service.extend({
  isAuthenticated: false,
  currentUser: null,
  currentPermission: null,
  isSystemRoot: false,

  authenticate(url){
    return this._serverAuth(url);
  },

  _serverAuth(loginUrl){
    let that = this;
    console.info(`[ember-cli-devise-can:service:session:_serverAuth] loginUrl: ${loginUrl}`)
    return new Ember.RSVP.Promise( (resolve, reject) =>{
      Ember.$.ajax(loginUrl, {
        success: (res) => {
          console.info(`[ember-cli-devise-can:service:session:_serverAuth] ajax success`) 
          that.setAuthenticateData(res);
          if( resolve ) resolve(res);
        },
        error: (error) => {
          console.error(`[ember-cli-devise-can:service:session:_serverAuth] ajax error: ${inspect(error)} `)
          that.clearAuthenticateData();
          if( reject ) reject(error);
        }
      })
    }) // end new Ember RSVP
  }, 

    /** 数据结构
      { 
        uid: 'xxoo', givenName: 'xxx', sn: '00',
        mail: 'zhangsan@mailtest.xiangrikui.com', department: '技术部/a组/a1组/a6组',
        mobile: 'xxx', weixin: null, qq: null, state: 2,
        isRoot: false, permissions: {}, jiraStatus: 0 
      }
    **/
  setAuthenticateData(userData){
    if( isBlank(userData) ) return;
    let { email, uid, isRoot, permissions } = userData;
    this.setProperties({
      isAuthenticated: true,
      isSystemRoot: isRoot,
      currentUser: { email: email, account: uid},
      currentPermission: permissions
    })
  },

  clearAuthenticateData(){
    this.setProperties({
      isAuthenticated: false,
      isSystemRoot: false,
      currentUser: null,
      currentPermission: null
    })
  },

  existPermissions(){
    let pers = this.get("currentPermission");
    return isPresent(pers) && Object.keys(pers).length > 0;
  },

  hasPermission(key){
    if( !this.existPermissions() ) return;
    let result = this.get("currentPermission");
    if(key){
      return result[key];
    }
    return result;
  },   

  canHandleResource(resource){
    return isPresent(this.hasPermission(resource));
  },

  canHandleAction(resource, action){
    let resAccess = this.canHandleResource(resource);
    let compareResult = false;
    if(resAccess){
      let _pers = this.hasPermission(resource);
      compareResult = _pers.any( (_per) => {
        return _per.name === action;
      })
    }
    return compareResult;
  },

  isMySelfResource(target, key){
    let user = this.get("currentUser");
    let identity = user.email || user.mail;
    return target[key] === identity;
  },

  canHandleTarget(resource, action, target, key){
    let isMe = this.isMySelfResource(target, key);
    if(!isMe){
     return this.canHandleAction(resource, action); 
    }
    return true;
  },

  cancancan(){
    if( this.get("isSystemRoot") ) return true;
    let result = false, len = arguments.length;
    switch(  len ){
      case 1:
        result = this.canHandleResource(...arguments);
        break;

      case 2:
        result = this.canHandleAction(...arguments);
        break;

      case 4:
        result = this.canHandleTarget(...arguments);
        break;

      default:
        console.info(" illegal Authorization process ... ");
    }
    return result;
  },

});
