'use strict';

customElements.define(
  'compodoc-menu',
  class extends HTMLElement {
    constructor() {
      super();
      this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
      this.render(this.isNormalMode);
    }

    render(isNormalMode) {
      let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : ''}
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                          isNormalMode
                            ? 'data-bs-target="#components-links"'
                            : 'data-bs-target="#xs-components-links"'
                        }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${isNormalMode ? 'id="components-links"' : 'id="xs-components-links"'}>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BarComponent.html" data-type="entity-link" >BarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BookComponent.html" data-type="entity-link" >BookComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CommonPopupComponent.html" data-type="entity-link" >CommonPopupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DetailBookComponent.html" data-type="entity-link" >DetailBookComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FavoritesComponent.html" data-type="entity-link" >FavoritesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GoogleHomeComponent.html" data-type="entity-link" >GoogleHomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeaderComponent.html" data-type="entity-link" >HeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LayoutComponent.html" data-type="entity-link" >LayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoaderComponent.html" data-type="entity-link" >LoaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MiniLoaderComponent.html" data-type="entity-link" >MiniLoaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MyBooksComponent.html" data-type="entity-link" >MyBooksComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotificationComponent.html" data-type="entity-link" >NotificationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PaginationInputComponent.html" data-type="entity-link" >PaginationInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PdfViewerComponent.html" data-type="entity-link" >PdfViewerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SearchBookComponent.html" data-type="entity-link" >SearchBookComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SearchComponent.html" data-type="entity-link" >SearchComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ShowAllComponent.html" data-type="entity-link" >ShowAllComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SignupComponent.html" data-type="entity-link" >SignupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarComponent.html" data-type="entity-link" >StarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UploadComponent.html" data-type="entity-link" >UploadComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                              isNormalMode
                                ? 'data-bs-target="#directives-links"'
                                : 'data-bs-target="#xs-directives-links"'
                            }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"'}>
                                <li class="link">
                                    <a href="directives/DestroyDirective.html" data-type="entity-link" >DestroyDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/PasswordNotEmailDirective.html" data-type="entity-link" >PasswordNotEmailDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/PasswordRepeatDirective.html" data-type="entity-link" >PasswordRepeatDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                          isNormalMode
                            ? 'data-bs-target="#classes-links"'
                            : 'data-bs-target="#xs-classes-links"'
                        }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"'}>
                            <li class="link">
                                <a href="classes/ActiveParamUtil.html" data-type="entity-link" >ActiveParamUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/CodeMessageHandlerUtil.html" data-type="entity-link" >CodeMessageHandlerUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/Constants.html" data-type="entity-link" >Constants</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomRouterStateSerializer.html" data-type="entity-link" >CustomRouterStateSerializer</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                              isNormalMode
                                ? 'data-bs-target="#injectables-links"'
                                : 'data-bs-target="#xs-injectables-links"'
                            }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"'}>
                                <li class="link">
                                    <a href="injectables/AuthFirebaseFacade.html" data-type="entity-link" >AuthFirebaseFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthorEffects.html" data-type="entity-link" >AuthorEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthorFacade.html" data-type="entity-link" >AuthorFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BookEffects.html" data-type="entity-link" >BookEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommonPopupService.html" data-type="entity-link" >CommonPopupService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DatabaseService.html" data-type="entity-link" >DatabaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DetailBookEffects.html" data-type="entity-link" >DetailBookEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DetailBookFacade.html" data-type="entity-link" >DetailBookFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FavoritesEffects.html" data-type="entity-link" >FavoritesEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FavoriteService.html" data-type="entity-link" >FavoriteService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FavoritesFacade.html" data-type="entity-link" >FavoritesFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GoogleApiService.html" data-type="entity-link" >GoogleApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HomeFacade.html" data-type="entity-link" >HomeFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MyBooksEffects.html" data-type="entity-link" >MyBooksEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MyBooksFacade.html" data-type="entity-link" >MyBooksFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link" >NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RouterFacadeService.html" data-type="entity-link" >RouterFacadeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchEffects.html" data-type="entity-link" >SearchEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchFacade.html" data-type="entity-link" >SearchFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchLiveEffects.html" data-type="entity-link" >SearchLiveEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchLiveFacade.html" data-type="entity-link" >SearchLiveFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchStateService.html" data-type="entity-link" >SearchStateService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                          isNormalMode
                            ? 'data-bs-target="#interfaces-links"'
                            : 'data-bs-target="#xs-interfaces-links"'
                        }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"'}>
                            <li class="link">
                                <a href="interfaces/AuthorState.html" data-type="entity-link" >AuthorState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DetailBookState.html" data-type="entity-link" >DetailBookState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FavoritesState.html" data-type="entity-link" >FavoritesState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HeaderModalI.html" data-type="entity-link" >HeaderModalI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HomeNowState.html" data-type="entity-link" >HomeNowState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HomeState.html" data-type="entity-link" >HomeState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IActions.html" data-type="entity-link" >IActions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IActiveParams.html" data-type="entity-link" >IActiveParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBook.html" data-type="entity-link" >IBook</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBookItem.html" data-type="entity-link" >IBookItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBookItemAccessInfo.html" data-type="entity-link" >IBookItemAccessInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBookItemLayerInfo.html" data-type="entity-link" >IBookItemLayerInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBookItemSaleInfo.html" data-type="entity-link" >IBookItemSaleInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBookItemTransformed.html" data-type="entity-link" >IBookItemTransformed</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBookItemTransformedWithTotal.html" data-type="entity-link" >IBookItemTransformedWithTotal</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBookItemVolumeInfo.html" data-type="entity-link" >IBookItemVolumeInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDetailBook.html" data-type="entity-link" >IDetailBook</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDetailBookSmallInfo.html" data-type="entity-link" >IDetailBookSmallInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMenuBelowBar.html" data-type="entity-link" >IMenuBelowBar</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMenuItem.html" data-type="entity-link" >IMenuItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISearch.html" data-type="entity-link" >ISearch</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISearchDetail.html" data-type="entity-link" >ISearchDetail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISearchInfoDetail.html" data-type="entity-link" >ISearchInfoDetail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISearchSmall.html" data-type="entity-link" >ISearchSmall</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISelfBook.html" data-type="entity-link" >ISelfBook</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISelfBookUpload.html" data-type="entity-link" >ISelfBookUpload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUploadFilesAndCreateBookDatabase.html" data-type="entity-link" >IUploadFilesAndCreateBookDatabase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUser.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserInfoFromGoogle.html" data-type="entity-link" >IUserInfoFromGoogle</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserSign.html" data-type="entity-link" >IUserSign</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MyBooksState.html" data-type="entity-link" >MyBooksState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RouterState.html" data-type="entity-link" >RouterState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchLiveState.html" data-type="entity-link" >SearchLiveState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchState.html" data-type="entity-link" >SearchState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserState.html" data-type="entity-link" >UserState</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                              isNormalMode
                                ? 'data-bs-target="#pipes-links"'
                                : 'data-bs-target="#xs-pipes-links"'
                            }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"'}>
                                <li class="link">
                                    <a href="pipes/ReduceLetterPipe.html" data-type="entity-link" >ReduceLetterPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/TransformDateBookPipe.html" data-type="entity-link" >TransformDateBookPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/TransformFavoriteDatePipe.html" data-type="entity-link" >TransformFavoriteDatePipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                          isNormalMode
                            ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"'
                        }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"'}>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
      this.innerHTML = tp.strings;
    }
  }
);
