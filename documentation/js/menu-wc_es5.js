'use strict';

function _typeof(o) {
  '@babel/helpers - typeof';
  return (
    (_typeof =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (o) {
            return typeof o;
          }
        : function (o) {
            return o &&
              'function' == typeof Symbol &&
              o.constructor === Symbol &&
              o !== Symbol.prototype
              ? 'symbol'
              : typeof o;
          }),
    _typeof(o)
  );
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, 'prototype', { writable: false });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, 'string');
  return 'symbol' == _typeof(i) ? i : i + '';
}
function _toPrimitive(t, r) {
  if ('object' != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || 'default');
    if ('object' != _typeof(i)) return i;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return ('string' === r ? String : Number)(t);
}
function _callSuper(t, o, e) {
  return (
    (o = _getPrototypeOf(o)),
    _possibleConstructorReturn(
      t,
      _isNativeReflectConstruct()
        ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor)
        : o.apply(t, e)
    )
  );
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError('Derived constructors may only return object or undefined');
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  Object.defineProperty(subClass, 'prototype', { writable: false });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === 'function' ? new Map() : undefined;
  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;
    if (typeof Class !== 'function') {
      throw new TypeError('Super expression must either be null or a function');
    }
    if (typeof _cache !== 'undefined') {
      if (_cache.has(Class)) return _cache.get(Class);
      _cache.set(Class, Wrapper);
    }
    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true },
    });
    return _setPrototypeOf(Wrapper, Class);
  };
  return _wrapNativeSuper(Class);
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _isNativeFunction(fn) {
  try {
    return Function.toString.call(fn).indexOf('[native code]') !== -1;
  } catch (e) {
    return typeof fn === 'function';
  }
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf
    ? Object.setPrototypeOf.bind()
    : function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };
  return _setPrototypeOf(o, p);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf.bind()
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}
customElements.define(
  'compodoc-menu',
  /*#__PURE__*/ (function (_HTMLElement) {
    function _class() {
      var _this;
      _classCallCheck(this, _class);
      _this = _callSuper(this, _class);
      _this.isNormalMode = _this.getAttribute('mode') === 'normal';
      return _this;
    }
    _inherits(_class, _HTMLElement);
    return _createClass(_class, [
      {
        key: 'connectedCallback',
        value: function connectedCallback() {
          this.render(this.isNormalMode);
        },
      },
      {
        key: 'render',
        value: function render(isNormalMode) {
          var tp = lithtml.html(
            '\n        <nav>\n            <ul class="list">\n                <li class="title">\n                    <a href="index.html" data-type="index-link">frontend documentation</a>\n                </li>\n\n                <li class="divider"></li>\n                '
              .concat(
                isNormalMode
                  ? '<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>'
                  : '',
                '\n                <li class="chapter">\n                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>\n                    <ul class="links">\n                        <li class="link">\n                            <a href="overview.html" data-type="chapter-link">\n                                <span class="icon ion-ios-keypad"></span>Overview\n                            </a>\n                        </li>\n                        <li class="link">\n                            <a href="index.html" data-type="chapter-link">\n                                <span class="icon ion-ios-paper"></span>README\n                            </a>\n                        </li>\n                                <li class="link">\n                                    <a href="dependencies.html" data-type="chapter-link">\n                                        <span class="icon ion-ios-list"></span>Dependencies\n                                    </a>\n                                </li>\n                                <li class="link">\n                                    <a href="properties.html" data-type="chapter-link">\n                                        <span class="icon ion-ios-apps"></span>Properties\n                                    </a>\n                                </li>\n                    </ul>\n                </li>\n                    <li class="chapter">\n                        <div class="simple menu-toggler" data-bs-toggle="collapse" '
              )
              .concat(
                isNormalMode
                  ? 'data-bs-target="#components-links"'
                  : 'data-bs-target="#xs-components-links"',
                '>\n                            <span class="icon ion-md-cog"></span>\n                            <span>Components</span>\n                            <span class="icon ion-ios-arrow-down"></span>\n                        </div>\n                        <ul class="links collapse " '
              )
              .concat(
                isNormalMode ? 'id="components-links"' : 'id="xs-components-links"',
                '>\n                            <li class="link">\n                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/BarComponent.html" data-type="entity-link" >BarComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/BookComponent.html" data-type="entity-link" >BookComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/CommonPopupComponent.html" data-type="entity-link" >CommonPopupComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/DetailBookComponent.html" data-type="entity-link" >DetailBookComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/FavoritesComponent.html" data-type="entity-link" >FavoritesComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/GoogleHomeComponent.html" data-type="entity-link" >GoogleHomeComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/HeaderComponent.html" data-type="entity-link" >HeaderComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/LayoutComponent.html" data-type="entity-link" >LayoutComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/LoaderComponent.html" data-type="entity-link" >LoaderComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/MiniLoaderComponent.html" data-type="entity-link" >MiniLoaderComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/MyBooksComponent.html" data-type="entity-link" >MyBooksComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/NotificationComponent.html" data-type="entity-link" >NotificationComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/PaginationInputComponent.html" data-type="entity-link" >PaginationInputComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/PdfViewerComponent.html" data-type="entity-link" >PdfViewerComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/SearchBookComponent.html" data-type="entity-link" >SearchBookComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/SearchComponent.html" data-type="entity-link" >SearchComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/ShowAllComponent.html" data-type="entity-link" >ShowAllComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/SignupComponent.html" data-type="entity-link" >SignupComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/StarComponent.html" data-type="entity-link" >StarComponent</a>\n                            </li>\n                            <li class="link">\n                                <a href="components/UploadComponent.html" data-type="entity-link" >UploadComponent</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class="chapter">\n                            <div class="simple menu-toggler" data-bs-toggle="collapse" '
              )
              .concat(
                isNormalMode
                  ? 'data-bs-target="#directives-links"'
                  : 'data-bs-target="#xs-directives-links"',
                '>\n                                <span class="icon ion-md-code-working"></span>\n                                <span>Directives</span>\n                                <span class="icon ion-ios-arrow-down"></span>\n                            </div>\n                            <ul class="links collapse " '
              )
              .concat(
                isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"',
                '>\n                                <li class="link">\n                                    <a href="directives/DestroyDirective.html" data-type="entity-link" >DestroyDirective</a>\n                                </li>\n                                <li class="link">\n                                    <a href="directives/PasswordNotEmailDirective.html" data-type="entity-link" >PasswordNotEmailDirective</a>\n                                </li>\n                                <li class="link">\n                                    <a href="directives/PasswordRepeatDirective.html" data-type="entity-link" >PasswordRepeatDirective</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class="chapter">\n                        <div class="simple menu-toggler" data-bs-toggle="collapse" '
              )
              .concat(
                isNormalMode
                  ? 'data-bs-target="#classes-links"'
                  : 'data-bs-target="#xs-classes-links"',
                '>\n                            <span class="icon ion-ios-paper"></span>\n                            <span>Classes</span>\n                            <span class="icon ion-ios-arrow-down"></span>\n                        </div>\n                        <ul class="links collapse " '
              )
              .concat(
                isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"',
                '>\n                            <li class="link">\n                                <a href="classes/ActiveParamUtil.html" data-type="entity-link" >ActiveParamUtil</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/CodeMessageHandlerUtil.html" data-type="entity-link" >CodeMessageHandlerUtil</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/Constants.html" data-type="entity-link" >Constants</a>\n                            </li>\n                            <li class="link">\n                                <a href="classes/CustomRouterStateSerializer.html" data-type="entity-link" >CustomRouterStateSerializer</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class="chapter">\n                            <div class="simple menu-toggler" data-bs-toggle="collapse" '
              )
              .concat(
                isNormalMode
                  ? 'data-bs-target="#injectables-links"'
                  : 'data-bs-target="#xs-injectables-links"',
                '>\n                                <span class="icon ion-md-arrow-round-down"></span>\n                                <span>Injectables</span>\n                                <span class="icon ion-ios-arrow-down"></span>\n                            </div>\n                            <ul class="links collapse " '
              )
              .concat(
                isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"',
                '>\n                                <li class="link">\n                                    <a href="injectables/AuthFirebaseFacade.html" data-type="entity-link" >AuthFirebaseFacade</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/AuthorEffects.html" data-type="entity-link" >AuthorEffects</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/AuthorFacade.html" data-type="entity-link" >AuthorFacade</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/BookEffects.html" data-type="entity-link" >BookEffects</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/CommonPopupService.html" data-type="entity-link" >CommonPopupService</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/DatabaseService.html" data-type="entity-link" >DatabaseService</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/DetailBookEffects.html" data-type="entity-link" >DetailBookEffects</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/DetailBookFacade.html" data-type="entity-link" >DetailBookFacade</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/FavoritesEffects.html" data-type="entity-link" >FavoritesEffects</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/FavoriteService.html" data-type="entity-link" >FavoriteService</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/FavoritesFacade.html" data-type="entity-link" >FavoritesFacade</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/GoogleApiService.html" data-type="entity-link" >GoogleApiService</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/HomeFacade.html" data-type="entity-link" >HomeFacade</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/MyBooksEffects.html" data-type="entity-link" >MyBooksEffects</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/MyBooksFacade.html" data-type="entity-link" >MyBooksFacade</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/NotificationService.html" data-type="entity-link" >NotificationService</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/RouterFacadeService.html" data-type="entity-link" >RouterFacadeService</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/SearchEffects.html" data-type="entity-link" >SearchEffects</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/SearchFacade.html" data-type="entity-link" >SearchFacade</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/SearchLiveEffects.html" data-type="entity-link" >SearchLiveEffects</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/SearchLiveFacade.html" data-type="entity-link" >SearchLiveFacade</a>\n                                </li>\n                                <li class="link">\n                                    <a href="injectables/SearchStateService.html" data-type="entity-link" >SearchStateService</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class="chapter">\n                        <div class="simple menu-toggler" data-bs-toggle="collapse" '
              )
              .concat(
                isNormalMode
                  ? 'data-bs-target="#interfaces-links"'
                  : 'data-bs-target="#xs-interfaces-links"',
                '>\n                            <span class="icon ion-md-information-circle-outline"></span>\n                            <span>Interfaces</span>\n                            <span class="icon ion-ios-arrow-down"></span>\n                        </div>\n                        <ul class="links collapse " '
              )
              .concat(
                isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"',
                '>\n                            <li class="link">\n                                <a href="interfaces/AuthorState.html" data-type="entity-link" >AuthorState</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/DetailBookState.html" data-type="entity-link" >DetailBookState</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/FavoritesState.html" data-type="entity-link" >FavoritesState</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/HeaderModalI.html" data-type="entity-link" >HeaderModalI</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/HomeNowState.html" data-type="entity-link" >HomeNowState</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/HomeState.html" data-type="entity-link" >HomeState</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IActions.html" data-type="entity-link" >IActions</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IActiveParams.html" data-type="entity-link" >IActiveParams</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IBook.html" data-type="entity-link" >IBook</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IBookItem.html" data-type="entity-link" >IBookItem</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IBookItemAccessInfo.html" data-type="entity-link" >IBookItemAccessInfo</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IBookItemLayerInfo.html" data-type="entity-link" >IBookItemLayerInfo</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IBookItemSaleInfo.html" data-type="entity-link" >IBookItemSaleInfo</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IBookItemTransformed.html" data-type="entity-link" >IBookItemTransformed</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IBookItemTransformedWithTotal.html" data-type="entity-link" >IBookItemTransformedWithTotal</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IBookItemVolumeInfo.html" data-type="entity-link" >IBookItemVolumeInfo</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IDetailBook.html" data-type="entity-link" >IDetailBook</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IDetailBookSmallInfo.html" data-type="entity-link" >IDetailBookSmallInfo</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IMenuBelowBar.html" data-type="entity-link" >IMenuBelowBar</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IMenuItem.html" data-type="entity-link" >IMenuItem</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/ISearch.html" data-type="entity-link" >ISearch</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/ISearchDetail.html" data-type="entity-link" >ISearchDetail</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/ISearchInfoDetail.html" data-type="entity-link" >ISearchInfoDetail</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/ISearchSmall.html" data-type="entity-link" >ISearchSmall</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/ISelfBook.html" data-type="entity-link" >ISelfBook</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/ISelfBookUpload.html" data-type="entity-link" >ISelfBookUpload</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IUploadFilesAndCreateBookDatabase.html" data-type="entity-link" >IUploadFilesAndCreateBookDatabase</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IUser.html" data-type="entity-link" >IUser</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IUserInfoFromGoogle.html" data-type="entity-link" >IUserInfoFromGoogle</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/IUserSign.html" data-type="entity-link" >IUserSign</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/MyBooksState.html" data-type="entity-link" >MyBooksState</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/RouterState.html" data-type="entity-link" >RouterState</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/SearchLiveState.html" data-type="entity-link" >SearchLiveState</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/SearchState.html" data-type="entity-link" >SearchState</a>\n                            </li>\n                            <li class="link">\n                                <a href="interfaces/UserState.html" data-type="entity-link" >UserState</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class="chapter">\n                            <div class="simple menu-toggler" data-bs-toggle="collapse" '
              )
              .concat(
                isNormalMode ? 'data-bs-target="#pipes-links"' : 'data-bs-target="#xs-pipes-links"',
                '>\n                                <span class="icon ion-md-add"></span>\n                                <span>Pipes</span>\n                                <span class="icon ion-ios-arrow-down"></span>\n                            </div>\n                            <ul class="links collapse " '
              )
              .concat(
                isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"',
                '>\n                                <li class="link">\n                                    <a href="pipes/ReduceLetterPipe.html" data-type="entity-link" >ReduceLetterPipe</a>\n                                </li>\n                                <li class="link">\n                                    <a href="pipes/TransformDateBookPipe.html" data-type="entity-link" >TransformDateBookPipe</a>\n                                </li>\n                                <li class="link">\n                                    <a href="pipes/TransformFavoriteDatePipe.html" data-type="entity-link" >TransformFavoriteDatePipe</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class="chapter">\n                        <div class="simple menu-toggler" data-bs-toggle="collapse" '
              )
              .concat(
                isNormalMode
                  ? 'data-bs-target="#miscellaneous-links"'
                  : 'data-bs-target="#xs-miscellaneous-links"',
                '>\n                            <span class="icon ion-ios-cube"></span>\n                            <span>Miscellaneous</span>\n                            <span class="icon ion-ios-arrow-down"></span>\n                        </div>\n                        <ul class="links collapse " '
              )
              .concat(
                isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"',
                '>\n                            <li class="link">\n                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>\n                            </li>\n                            <li class="link">\n                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>\n                            </li>\n                            <li class="link">\n                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>\n                            </li>\n                            <li class="link">\n                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class="chapter">\n                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>\n                    </li>\n                    <li class="divider"></li>\n                    <li class="copyright">\n                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">\n                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">\n                        </a>\n                    </li>\n            </ul>\n        </nav>\n        '
              )
          );
          this.innerHTML = tp.strings;
        },
      },
    ]);
  })(/*#__PURE__*/ _wrapNativeSuper(HTMLElement))
);
