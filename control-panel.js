(() => {
    const STORAGE_KEY = 'portfolioControlPanelState.v1';
    const STORAGE_LIGHT_KEY = 'portfolioControlPanelState.light.v1';
    const STORAGE_ADDED_KEY = 'portfolioControlPanelAddedCards.v1';
    const SESSION_KEY = 'portfolioControlPanelAuth.v1';
    const AUTH_CREDENTIALS_KEY = 'portfolioControlPanelCredentials.v1';
    const DEFAULT_AUTH = {
        username: 'Abdelrahman',
        password: '01141354236'
    };
    const CONTROL_PANEL_ENABLED = document.body && document.body.dataset.controlPanelEnabled === 'true';

    if (!CONTROL_PANEL_ENABLED) {
        const launcher = document.getElementById('cpLauncher');
        if (launcher) {
            launcher.hidden = true;
            launcher.setAttribute('aria-hidden', 'true');
        }
        return;
    }

    const TEXT = {
        ar: {
            launcherText: 'CONTROL PANEL',
            loginTitle: 'تسجيل دخول لوحة التحكم',
            loginHint: 'أدخل بيانات الدخول لفتح لوحة التحكم',
            loginUserLabel: 'اسم المستخدم',
            loginPassLabel: 'كلمة المرور',
            loginUserPlaceholder: 'اسم المستخدم',
            loginPassPlaceholder: 'كلمة المرور',
            loginButton: 'دخول',
            loginError: 'بيانات الدخول غير صحيحة',
            panelTitle: 'لوحة التحكم',
            panelSubtitle: 'تحكم كامل في محتوى البروتوفيلو',
            adminToolsShow: 'إظهار أدوات الأدمن',
            adminToolsHide: 'إخفاء أدوات الأدمن',
            workspaceKicker: 'لوحة منظمة حسب الأقسام',
            workspaceNote: 'كل تاب يفتح مساحة تعديل مستقلة لنفس القسم بدون تداخل مع باقي الأقسام.',
            sectionsGroupTitle: 'أقسام البروتوفيلو',
            collectionsGroupTitle: 'بطاقات المحتوى',
            systemGroupTitle: 'أدوات النظام',
            sectionWorkspaceTitle: 'مساحة القسم',
            sectionWorkspaceDesc: 'كل ما يخص القسم المختار يظهر هنا بوضوح: نصوص، صور، حالة الظهور، ومعاينة مباشرة.',
            sectionPreviewTitle: 'معاينة القسم',
            sectionPreviewDesc: 'هذه المعاينة تعرض نفس محتوى تاب البروتوفيلو المختار لتعديل أسرع وأسهل.',
            sectionVisibilityLabel: 'القسم ظاهر في الموقع',
            openSectionBtn: 'فتح القسم',
            valuesTitle: 'تعديل القيم مباشرة',
            valuesDesc: 'اختر القسم ثم عدل القيم من الحقول بسهولة',
            valuesSectionLabel: 'القسم',
            valuesSaveBtn: 'حفظ تعديلات القسم',
            valuesSaved: 'تم حفظ تعديلات القسم',
            valuesNoFields: 'لا توجد قيم نصية قابلة للتعديل في هذا القسم',
            imagesTitle: 'مدير الصور',
            imagesDesc: 'اختر القسم ثم ارفع أي صورة لكل عنصر مباشرة',
            imagesSectionLabel: 'قسم الصور',
            imageUploadBtn: 'رفع صورة',
            imageSaved: 'تم حفظ الصورة',
            imageNoItems: 'لا توجد صور في هذا القسم',
            itemEditorTitle: 'محرر العناصر',
            itemEditorDesc: 'اضغط على أي عنصر لفتح كل حقوله وتعديلها بسهولة',
            itemTypeLabel: 'نوع المحتوى',
            itemTypeCertificates: 'الشهادات',
            itemTypeProjects: 'المشاريع',
            itemTypeServices: 'الخدمات',
            itemAddBtn: 'إضافة عنصر جديد',
            itemNoItems: 'لا توجد عناصر في هذا القسم',
            itemSaveBtn: 'حفظ العنصر',
            itemSaved: 'تم حفظ العنصر',
            itemAdded: 'تمت إضافة عنصر جديد',
            fieldTitle: 'العنوان',
            fieldOrganization: 'الجهة',
            fieldDescription: 'الوصف',
            fieldTag: 'التصنيف',
            fieldButtonLabel: 'نص الزر',
            fieldButtonUrl: 'رابط الزر',
            switchLang: 'English',
            toolsTitle: 'أدوات مباشرة',
            toolsDesc: 'اختر وضع تحكم واحد فقط في كل مرة',
            modeTextBtn: 'تعديل النصوص',
            modeImageBtn: 'استبدال الصور',
            modeDeleteBtn: 'حذف عنصر',
            modeOffBtn: 'إيقاف الأوضاع',
            sectionsTitle: 'إدارة الأقسام',
            sectionsDesc: 'إظهار أو إخفاء أي قسم من البروتوفيلو',
            addTitle: 'إضافة محتوى جديد',
            addDesc: 'أضف بطاقة جديدة في المشاريع أو الشهادات أو الخدمات',
            addTargetLabel: 'مكان الإضافة',
            targetProjects: 'المشاريع',
            targetCertificates: 'الشهادات',
            targetServices: 'الخدمات',
            addTitleLabel: 'العنوان',
            addDescriptionLabel: 'الوصف',
            addImageLabel: 'رابط الصورة (اختياري)',
            addLinkLabel: 'رابط الزر (اختياري)',
            addButtonLabel: 'اسم الزر (اختياري)',
            addTitlePlaceholder: 'اكتب عنوان العنصر',
            addDescriptionPlaceholder: 'اكتب وصف مختصر',
            addImagePlaceholder: 'https://example.com/image.jpg',
            addLinkPlaceholder: 'https://example.com',
            addButtonPlaceholder: 'فتح التفاصيل',
            addSubmitBtn: 'إضافة الآن',
            utilitiesTitle: 'أدوات الإدارة',
            restoreHiddenBtn: 'استرجاع العناصر المخفية',
            exportBtn: 'تصدير النسخة الاحتياطية',
            importBtn: 'استيراد النسخة الاحتياطية',
            resetBtn: 'إعادة ضبط كل التعديلات',
            logoutBtn: 'تسجيل خروج',
            modeTextOn: 'وضع تعديل النصوص مفعل',
            modeImageOn: 'وضع استبدال الصور مفعل',
            modeDeleteOn: 'وضع حذف العناصر مفعل',
            modeOff: 'تم إيقاف كل الأوضاع',
            textSaved: 'تم حفظ تعديل النص',
            chooseImage: 'اختر صورة من جهازك',
            imageUpdated: 'تم تحديث الصورة وحفظها',
            imageInvalid: 'الملف المختار ليس صورة',
            itemDeleted: 'تم حذف العنصر (إخفاؤه)',
            restoreDone: 'تم استرجاع العناصر المخفية',
            addDone: 'تمت إضافة العنصر بنجاح',
            addFail: 'تعذر إضافة العنصر في هذا القسم',
            addRequired: 'العنوان والوصف مطلوبان',
            backupExported: 'تم تنزيل نسخة احتياطية',
            backupImported: 'تم استيراد النسخة الاحتياطية',
            importFail: 'ملف النسخة الاحتياطية غير صالح',
            confirmDelete: 'هل تريد حذف هذا العنصر؟',
            confirmReset: 'هل تريد إعادة ضبط كل التعديلات؟',
            resetDone: 'تمت إعادة الضبط',
            loginSuccess: 'تم تسجيل الدخول بنجاح',
            logoutDone: 'تم تسجيل الخروج',
            storageLimit: 'المساحة ممتلئة. استخدم صورة أصغر أو صدّر نسخة احتياطية أولًا.',
            quickActionsTitle: 'إجراءات سريعة',
            quickGoProfile: 'تعديل البيانات',
            quickGoSection: 'القسم الحالي',
            quickGoProjects: 'إدارة المشاريع',
            quickGoCertificates: 'إدارة الشهادات',
            quickFixNavbar: 'إصلاح شريط التنقل',
            navbarFixed: 'تم إصلاح شريط التنقل وتأمينه',
            sectionShown: 'تم إظهار القسم',
            sectionHidden: 'تم إخفاء القسم'
        },
        en: {
            launcherText: 'CONTROL PANEL',
            loginTitle: 'Control Panel Login',
            loginHint: 'Enter credentials to open the control panel',
            loginUserLabel: 'Username',
            loginPassLabel: 'Password',
            loginUserPlaceholder: 'Username',
            loginPassPlaceholder: 'Password',
            loginButton: 'Login',
            loginError: 'Invalid username or password',
            panelTitle: 'Control Panel',
            panelSubtitle: 'Full control over portfolio content',
            adminToolsShow: 'Show Admin Tools',
            adminToolsHide: 'Hide Admin Tools',
            workspaceKicker: 'Section-first admin',
            workspaceNote: 'Each tab opens a dedicated editing workspace for its own section without mixing content together.',
            sectionsGroupTitle: 'Portfolio Sections',
            collectionsGroupTitle: 'Content Collections',
            systemGroupTitle: 'System Controls',
            sectionWorkspaceTitle: 'Section Workspace',
            sectionWorkspaceDesc: 'Everything related to the selected section appears here clearly: text, images, visibility, and live preview.',
            sectionPreviewTitle: 'Section Preview',
            sectionPreviewDesc: 'This preview mirrors the selected portfolio tab so editing stays smooth and clear.',
            sectionVisibilityLabel: 'Section visible on site',
            openSectionBtn: 'Open Section',
            valuesTitle: 'Edit Values Directly',
            valuesDesc: 'Pick a section and edit its values from simple fields',
            valuesSectionLabel: 'Section',
            valuesSaveBtn: 'Save Section Changes',
            valuesSaved: 'Section values saved',
            valuesNoFields: 'No editable text values found in this section',
            imagesTitle: 'Image Manager',
            imagesDesc: 'Select a section then upload any image per item',
            imagesSectionLabel: 'Images Section',
            imageUploadBtn: 'Upload Image',
            imageSaved: 'Image saved',
            imageNoItems: 'No images found in this section',
            itemEditorTitle: 'Items Editor',
            itemEditorDesc: 'Click any item to open all editable fields',
            itemTypeLabel: 'Content Type',
            itemTypeCertificates: 'Certificates',
            itemTypeProjects: 'Projects',
            itemTypeServices: 'Services',
            itemAddBtn: 'Add New Item',
            itemNoItems: 'No items in this section',
            itemSaveBtn: 'Save Item',
            itemSaved: 'Item saved',
            itemAdded: 'New item added',
            fieldTitle: 'Title',
            fieldOrganization: 'Organization',
            fieldDescription: 'Description',
            fieldTag: 'Tag',
            fieldButtonLabel: 'Button Label',
            fieldButtonUrl: 'Button URL',
            switchLang: 'العربية',
            toolsTitle: 'Quick Tools',
            toolsDesc: 'Use one control mode at a time',
            modeTextBtn: 'Edit Text',
            modeImageBtn: 'Replace Images',
            modeDeleteBtn: 'Delete Item',
            modeOffBtn: 'Disable Modes',
            sectionsTitle: 'Sections Manager',
            sectionsDesc: 'Show or hide any portfolio section',
            addTitle: 'Add New Content',
            addDesc: 'Add a new card to Projects, Certificates, or Services',
            addTargetLabel: 'Add To',
            targetProjects: 'Projects',
            targetCertificates: 'Certificates',
            targetServices: 'Services',
            addTitleLabel: 'Title',
            addDescriptionLabel: 'Description',
            addImageLabel: 'Image URL (optional)',
            addLinkLabel: 'Button URL (optional)',
            addButtonLabel: 'Button Label (optional)',
            addTitlePlaceholder: 'Enter card title',
            addDescriptionPlaceholder: 'Enter short description',
            addImagePlaceholder: 'https://example.com/image.jpg',
            addLinkPlaceholder: 'https://example.com',
            addButtonPlaceholder: 'Open Details',
            addSubmitBtn: 'Add Now',
            utilitiesTitle: 'Management Tools',
            restoreHiddenBtn: 'Restore Hidden Items',
            exportBtn: 'Export Backup',
            importBtn: 'Import Backup',
            resetBtn: 'Reset All Changes',
            logoutBtn: 'Logout',
            modeTextOn: 'Text editing mode is active',
            modeImageOn: 'Image replace mode is active',
            modeDeleteOn: 'Delete mode is active',
            modeOff: 'All modes are disabled',
            textSaved: 'Text changes saved',
            chooseImage: 'Choose an image from your device',
            imageUpdated: 'Image updated and saved',
            imageInvalid: 'Selected file is not an image',
            itemDeleted: 'Item deleted (hidden)',
            restoreDone: 'Hidden items restored',
            addDone: 'Item added successfully',
            addFail: 'Cannot add item to this section',
            addRequired: 'Title and description are required',
            backupExported: 'Backup file downloaded',
            backupImported: 'Backup imported',
            importFail: 'Invalid backup file',
            confirmDelete: 'Do you want to delete this item?',
            confirmReset: 'Do you want to reset all changes?',
            resetDone: 'All changes were reset',
            loginSuccess: 'Login successful',
            logoutDone: 'Logged out',
            storageLimit: 'Storage limit reached. Use smaller image or export backup first.',
            quickActionsTitle: 'Quick Actions',
            quickGoProfile: 'Edit Profile',
            quickGoSection: 'Current Section',
            quickGoProjects: 'Manage Projects',
            quickGoCertificates: 'Manage Certificates',
            quickFixNavbar: 'Fix Navbar',
            navbarFixed: 'Navbar links were restored and protected',
            sectionShown: 'Section is visible again',
            sectionHidden: 'Section was hidden'
        }
    };

    const DEFAULT_STATE = () => ({
        lang: 'ar',
        textEdits: {},
        linkEdits: {},
        imageEdits: {},
        hiddenSelectors: [],
        sectionVisibility: {},
        addedCards: [],
        valueSection: 'home',
        imageSection: 'home',
        itemType: 'all',
        activeTab: 'section',
        activeItemTypeTab: 'all',
        activeSectionId: 'home',
        adminToolsExpanded: false
    });

    const els = {};
    let state = loadState();
    let authCredentials = loadCredentials();
    let mode = 'none';
    let hoverTarget = null;
    let editingTarget = null;
    let editingOriginal = '';
    let imageTarget = null;
    let statusTimer = null;
    let valueTargets = [];
    let pendingAddImageData = '';
    let pendingAddFileData = '';
    let pendingAddFileName = '';
    const DEFAULT_CARD_IMAGE = 'assets/images/service_webdesign.jpg';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        cacheElements();

        if (!els.launcher || !els.panel || !els.loginModal) {
            return;
        }

        els.launcher.hidden = false;
        els.launcher.removeAttribute('aria-hidden');

        sanitizeNavbarOverrides();
        bindEvents();
        applyLanguage(state.lang || 'ar');
        setAdminToolsExpanded(state.adminToolsExpanded === true, false);
        resetPendingAddUploads();
        applyState();
        migrateStoredSelectors();
        renderSectionManager();
        initValueEditor();
        initImageEditor();
        initItemEditor();
        initDashboardTabs();
        renderQuickSectionTabs();
        activateDashboardTab(state.activeTab || 'section', {
            itemType: state.activeItemTypeTab || state.itemType || 'all',
            sectionId: state.activeSectionId || state.valueSection || 'home',
            persist: false
        });

        if (sessionStorage.getItem(SESSION_KEY) === '1') {
            openPanel();
        }
    }

    function cacheElements() {
        els.launcher = document.getElementById('cpLauncher');
        els.overlay = document.getElementById('cpOverlay');
        els.panel = document.getElementById('cpPanel');
        els.loginModal = document.getElementById('cpLoginModal');
        els.closeLogin = document.getElementById('cpCloseLogin');
        els.loginForm = document.getElementById('cpLoginForm');
        els.username = document.getElementById('cpUsername');
        els.password = document.getElementById('cpPassword');
        els.loginError = document.getElementById('cpLoginError');

        els.closePanel = document.getElementById('cpClosePanel');
        els.langToggle = document.getElementById('cpLangToggle');
        els.tabStrip = els.panel.querySelector('.cp-tab-strip');
        els.tabContent = els.panel.querySelector('.cp-tab-content');
        els.adminToolsToggle = document.getElementById('cpAdminToolsToggle');
        els.adminTopGrid = els.panel.querySelector('.cp-admin-top-grid');
        els.sectionTabList = document.getElementById('cpSectionTabList');
        els.currentSectionTitle = document.getElementById('cpCurrentSectionTitle');
        els.currentSectionDescription = document.getElementById('cpCurrentSectionDescription');
        els.openSectionPreview = document.getElementById('cpOpenSectionPreview');
        els.currentSectionVisibility = document.getElementById('cpCurrentSectionVisibility');
        els.sectionPreview = document.getElementById('cpSectionPreview');
        els.valueSectionBadge = document.getElementById('cpValueSectionBadge');
        els.imageSectionBadge = document.getElementById('cpImageSectionBadge');
        els.newPasscode = document.getElementById('cpNewPasscode');
        els.savePasscode = document.getElementById('cpSavePasscode');
        els.modeText = document.getElementById('cpModeText');
        els.modeImage = document.getElementById('cpModeImage');
        els.modeDelete = document.getElementById('cpModeDelete');
        els.modeOff = document.getElementById('cpModeOff');

        els.sectionList = document.getElementById('cpSectionList');
        els.valueSection = document.getElementById('cpValueSection');
        els.valueList = document.getElementById('cpValueList');
        els.valueSave = document.getElementById('cpValueSave');
        els.imageSection = document.getElementById('cpImageSection');
        els.imageList = document.getElementById('cpImageList');
        els.itemType = document.getElementById('cpItemType');
        els.itemList = document.getElementById('cpItemList');
        els.addItemCard = document.getElementById('cpAddItemCard');

        els.addForm = document.getElementById('cpAddForm');
        els.addTarget = document.getElementById('cpAddTarget');
        els.addTitle = document.getElementById('cpAddTitle');
        els.addDescription = document.getElementById('cpAddDescription');
        els.addImage = document.getElementById('cpAddImage');
        els.addLink = document.getElementById('cpAddLink');
        els.addButtonLabel = document.getElementById('cpAddButtonLabel');
        els.addUploadImageBtn = document.getElementById('cpAddUploadImageBtn');
        els.addUploadFileBtn = document.getElementById('cpAddUploadFileBtn');
        els.addImageUploadName = document.getElementById('cpAddImageUploadName');
        els.addFileUploadName = document.getElementById('cpAddFileUploadName');
        els.addImageUploadInput = document.getElementById('cpAddImageUploadInput');
        els.addFileUploadInput = document.getElementById('cpAddFileUploadInput');

        els.restoreHidden = document.getElementById('cpRestoreHidden');
        els.exportState = document.getElementById('cpExportState');
        els.importState = document.getElementById('cpImportState');
        els.importInput = document.getElementById('cpImportStateInput');
        els.resetAll = document.getElementById('cpResetAll');
        els.logout = document.getElementById('cpLogout');
        els.quickProfile = document.getElementById('cpQuickProfile');
        els.quickProjects = document.getElementById('cpQuickProjects');
        els.quickCertificates = document.getElementById('cpQuickCertificates');
        els.fixNavbar = document.getElementById('cpFixNavbar');
        els.status = document.getElementById('cpStatus');
        els.imageInput = document.getElementById('cpImageUploadInput');
    }

    function bindEvents() {
        els.launcher.addEventListener('click', () => {
            if (sessionStorage.getItem(SESSION_KEY) === '1') {
                openPanel();
            } else {
                openLogin();
            }
        });

        els.overlay.addEventListener('click', () => {
            closeLogin();
            closePanel();
        });

        if (els.closeLogin) {
            els.closeLogin.addEventListener('click', closeLogin);
        }

        els.closePanel.addEventListener('click', closePanel);

        els.langToggle.addEventListener('click', () => {
            const next = state.lang === 'ar' ? 'en' : 'ar';
            applyLanguage(next);
            resetPendingAddUploads();
            saveState();
            renderSectionManager();
            initValueEditor();
            initImageEditor();
            initItemEditor();
            renderQuickSectionTabs();
            activateDashboardTab(state.activeTab || 'section', {
                itemType: state.activeItemTypeTab || state.itemType || 'all',
                sectionId: state.activeSectionId || state.valueSection || 'home',
                persist: false
            });
        });

        if (els.adminToolsToggle) {
            els.adminToolsToggle.addEventListener('click', () => {
                setAdminToolsExpanded(!(state.adminToolsExpanded === true), true);
            });
        }

        els.loginForm.addEventListener('submit', handleLogin);

        els.modeText.addEventListener('click', () => toggleMode('text'));
        els.modeImage.addEventListener('click', () => toggleMode('image'));
        els.modeDelete.addEventListener('click', () => toggleMode('delete'));
        els.modeOff.addEventListener('click', () => setMode('none'));

        if (els.valueSection) {
            els.valueSection.addEventListener('change', () => {
                state.valueSection = els.valueSection.value;
                state.imageSection = els.valueSection.value;
                state.activeSectionId = els.valueSection.value;
                setSelectValue(els.imageSection, state.imageSection);
                saveState();
                renderValueEditorFields(state.valueSection);
                renderImageEditor(state.imageSection);
                renderSectionWorkspace(state.activeSectionId);
                renderSectionPreview(state.activeSectionId);
            });
        }

        if (els.valueSave) {
            els.valueSave.addEventListener('click', applyValueEditorChanges);
        }

        if (els.imageSection) {
            els.imageSection.addEventListener('change', () => {
                state.imageSection = els.imageSection.value;
                state.valueSection = els.imageSection.value;
                state.activeSectionId = els.imageSection.value;
                setSelectValue(els.valueSection, state.valueSection);
                saveState();
                renderImageEditor(state.imageSection);
                renderValueEditorFields(state.valueSection);
                renderSectionWorkspace(state.activeSectionId);
                renderSectionPreview(state.activeSectionId);
            });
        }

        if (els.itemType) {
            els.itemType.addEventListener('change', () => {
                state.itemType = els.itemType.value;
                state.activeItemTypeTab = state.itemType;
                saveState();
                renderItemEditor(state.itemType);
                if (state.activeTab === 'items') {
                    activateDashboardTab('items', {
                        itemType: state.itemType,
                        persist: false
                    });
                }
            });
        }

        if (els.addItemCard) {
            els.addItemCard.addEventListener('click', addNewItemFromEditor);
        }

        els.addForm.addEventListener('submit', handleAddCard);
        if (els.addUploadImageBtn && els.addImageUploadInput) {
            els.addUploadImageBtn.addEventListener('click', () => els.addImageUploadInput.click());
            els.addImageUploadInput.addEventListener('change', handleAddImageUpload);
        }
        if (els.addUploadFileBtn && els.addFileUploadInput) {
            els.addUploadFileBtn.addEventListener('click', () => els.addFileUploadInput.click());
            els.addFileUploadInput.addEventListener('change', handleAddFileUpload);
        }
        els.restoreHidden.addEventListener('click', restoreHiddenItems);
        els.exportState.addEventListener('click', exportBackup);
        els.importState.addEventListener('click', () => els.importInput.click());
        els.importInput.addEventListener('change', importBackup);
        els.resetAll.addEventListener('click', resetAllChanges);
        els.logout.addEventListener('click', logout);
        if (els.savePasscode) {
            els.savePasscode.addEventListener('click', updatePasscode);
        }
        if (els.quickProfile) {
            els.quickProfile.addEventListener('click', () => {
                activateDashboardTab('section', {
                    sectionId: state.activeSectionId || state.valueSection || 'home',
                    focusEditor: true,
                    persist: true
                });
            });
        }
        if (els.quickProjects) {
            els.quickProjects.addEventListener('click', () => {
                activateDashboardTab('items', { itemType: 'projects', persist: true });
            });
        }
        if (els.quickCertificates) {
            els.quickCertificates.addEventListener('click', () => {
                activateDashboardTab('items', { itemType: 'certificates', persist: true });
            });
        }
        if (els.fixNavbar) {
            els.fixNavbar.addEventListener('click', () => {
                sanitizeNavbarOverrides();
                restoreNavbarDefaults();
                showStatus(t('navbarFixed'));
            });
        }
        if (els.openSectionPreview) {
            els.openSectionPreview.addEventListener('click', () => {
                openSiteSection(state.activeSectionId || state.valueSection || 'home');
            });
        }
        if (els.currentSectionVisibility) {
            els.currentSectionVisibility.addEventListener('change', () => {
                const sectionId = state.activeSectionId || state.valueSection || '';
                if (!sectionId) {
                    return;
                }
                setSectionVisibility(sectionId, els.currentSectionVisibility.checked, true);
                const managerToggle = els.sectionList
                    ? els.sectionList.querySelector(`[data-cp-section-toggle="${cssEscape(sectionId)}"]`)
                    : null;
                if (managerToggle) {
                    managerToggle.checked = els.currentSectionVisibility.checked;
                }
                renderSectionWorkspace(sectionId);
                showStatus(els.currentSectionVisibility.checked ? t('sectionShown') : t('sectionHidden'));
            });
        }
        if (els.newPasscode) {
            els.newPasscode.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    updatePasscode();
                }
            });
        }
        if (els.tabStrip) {
            els.tabStrip.addEventListener('click', handleTabStripClick);
        }

        els.imageInput.addEventListener('change', handleImageSelected);

        document.addEventListener('click', handlePageClick, true);
        document.addEventListener('mouseover', handlePageHover, true);
        document.addEventListener('mouseout', clearHoverIfNeeded, true);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (editingTarget) {
                    cancelInlineEdit();
                    return;
                }
                closeLogin();
                closePanel();
                setMode('none');
            }
        });
    }

    function handleLogin(event) {
        event.preventDefault();
        const username = (els.username.value || '').trim();
        const password = (els.password.value || '').trim();

        if (username === authCredentials.username && password === authCredentials.password) {
            els.loginError.textContent = '';
            sessionStorage.setItem(SESSION_KEY, '1');
            closeLogin();
            openPanel();
            showStatus(t('loginSuccess'));
            return;
        }

        els.loginError.textContent = t('loginError');
    }

    function openLogin() {
        els.overlay.classList.add('show');
        els.loginModal.classList.add('show');
        els.loginModal.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
            els.username.focus();
        }, 40);
    }

    function closeLogin() {
        els.loginModal.classList.remove('show');
        els.loginModal.setAttribute('aria-hidden', 'true');
        if (!els.panel.classList.contains('open')) {
            els.overlay.classList.remove('show');
        }
    }

    function openPanel() {
        els.overlay.classList.add('show');
        els.panel.classList.add('open');
        els.panel.setAttribute('aria-hidden', 'false');
        renderQuickSectionTabs();
        activateDashboardTab(state.activeTab || 'section', {
            itemType: state.activeItemTypeTab || state.itemType || 'all',
            sectionId: state.activeSectionId || state.valueSection || 'home',
            persist: false
        });
    }

    function closePanel() {
        els.panel.classList.remove('open');
        els.panel.setAttribute('aria-hidden', 'true');
        if (!els.loginModal.classList.contains('show')) {
            els.overlay.classList.remove('show');
        }
    }

    function logout() {
        sessionStorage.removeItem(SESSION_KEY);
        setMode('none');
        closePanel();
        showStatus(t('logoutDone'));
    }

    function setAdminToolsExpanded(expanded, persist = true) {
        const nextValue = expanded === true;
        state.adminToolsExpanded = nextValue;

        if (els.adminTopGrid) {
            els.adminTopGrid.classList.toggle('is-collapsed', !nextValue);
        }
        if (els.adminToolsToggle) {
            els.adminToolsToggle.textContent = nextValue ? t('adminToolsHide') : t('adminToolsShow');
            els.adminToolsToggle.setAttribute('aria-expanded', String(nextValue));
        }

        if (persist) {
            saveState();
        }
    }

    function initDashboardTabs() {
        if (!els.tabStrip) {
            return;
        }

        const firstBtn = els.panel.querySelector('.cp-tab-btn');
        if (firstBtn && !els.tabStrip.querySelector('.cp-tab-btn.is-active')) {
            firstBtn.classList.add('is-active');
        }
    }

    function getAvailableSections() {
        return Array.from(document.querySelectorAll('main .section-content[id]'));
    }

    function renderQuickSectionTabs() {
        if (!els.sectionTabList) {
            return;
        }

        els.sectionTabList.innerHTML = '';
        const sections = getAvailableSections();

        sections.forEach((section) => {
            const label = getSectionTitle(section);
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'cp-tab-btn cp-tab-btn-section';
            button.setAttribute('data-cp-tab-target', 'section');
            button.setAttribute('data-cp-section-id', section.id);
            button.textContent = label.length > 20 ? `${label.slice(0, 20)}...` : label;
            button.title = label;
            els.sectionTabList.appendChild(button);
        });
    }

    function handleTabStripClick(event) {
        const button = event.target.closest('.cp-tab-btn');
        if (!button || !els.tabStrip || !els.tabStrip.contains(button)) {
            return;
        }

        const tabTarget = button.getAttribute('data-cp-tab-target') || 'section';
        const itemType = button.getAttribute('data-cp-item-type') || '';
        const sectionId = button.getAttribute('data-cp-section-id') || '';

        activateDashboardTab(tabTarget, {
            itemType,
            sectionId,
            sourceButton: button,
            focusEditor: tabTarget === 'section',
            persist: true
        });
    }

    function activateDashboardTab(tabTarget, options = {}) {
        if (!els.panel) {
            return;
        }

        const sections = getAvailableSections();
        const firstSectionId = sections[0] ? sections[0].id : 'home';
        const normalizedTab = tabTarget === 'profile' ? 'section' : (tabTarget || 'section');
        const nextTab = normalizedTab;
        const sourceButton = options.sourceButton || null;
        const requestedSectionId = options.sectionId || state.activeSectionId || state.valueSection || firstSectionId;
        const sectionId = sections.some((section) => section.id === requestedSectionId) ? requestedSectionId : firstSectionId;
        const shouldPersist = options.persist !== false;

        const buttons = Array.from(els.panel.querySelectorAll('.cp-tab-btn'));
        buttons.forEach((btn) => btn.classList.remove('is-active'));

        let activeButton = sourceButton;
        if (!activeButton && nextTab === 'section' && sectionId) {
            activeButton = els.panel.querySelector(
                `.cp-tab-btn[data-cp-tab-target="section"][data-cp-section-id="${cssEscape(sectionId)}"]`
            );
        }

        const fallbackItemType = isItemTypeSupported(options.itemType)
            ? options.itemType
            : (isItemTypeSupported(state.activeItemTypeTab) ? state.activeItemTypeTab : 'all');

        if (!activeButton && nextTab === 'items') {
            activeButton = els.panel.querySelector(
                `.cp-tab-btn[data-cp-tab-target="items"][data-cp-item-type="${cssEscape(fallbackItemType)}"]`
            );
        }

        if (!activeButton) {
            activeButton = els.panel.querySelector(`.cp-tab-btn[data-cp-tab-target="${cssEscape(nextTab)}"]`);
        }
        if (!activeButton && buttons.length > 0) {
            activeButton = buttons[0];
        }
        if (activeButton) {
            activeButton.classList.add('is-active');
        }

        const panels = Array.from(els.panel.querySelectorAll('.cp-tab-panel'));
        panels.forEach((panel) => {
            panel.classList.toggle('is-active', panel.getAttribute('data-cp-tab-panel') === nextTab);
        });

        if (nextTab === 'items' && els.itemType) {
            els.itemType.value = fallbackItemType;
            state.itemType = fallbackItemType;
            state.activeItemTypeTab = fallbackItemType;
            renderItemEditor(fallbackItemType);
            if (els.addTarget && (fallbackItemType === 'projects' || fallbackItemType === 'certificates' || fallbackItemType === 'services')) {
                els.addTarget.value = fallbackItemType;
            }
        }

        if (nextTab === 'section' && sectionId) {
            if (setSelectValue(els.valueSection, sectionId)) {
                state.valueSection = sectionId;
                renderValueEditorFields(sectionId);
            }
            if (setSelectValue(els.imageSection, sectionId)) {
                state.imageSection = sectionId;
                renderImageEditor(sectionId);
            }
            state.activeSectionId = sectionId;
            renderSectionWorkspace(sectionId);
            renderSectionPreview(sectionId);
            if (options.focusEditor) {
                focusSectionEditors();
            }
        }

        state.activeTab = nextTab;
        if (shouldPersist) {
            saveState();
        }
    }

    function setSelectValue(selectEl, value) {
        if (!selectEl || !value) {
            return false;
        }
        const option = Array.from(selectEl.options || []).find((item) => item.value === value);
        if (!option) {
            return false;
        }
        selectEl.value = value;
        return true;
    }

    function isItemTypeSupported(value) {
        return value === 'all' || value === 'projects' || value === 'certificates' || value === 'services';
    }

    function updatePasscode() {
        if (!els.newPasscode) {
            return;
        }

        const nextPasscode = (els.newPasscode.value || '').trim();
        if (nextPasscode.length < 4) {
            showStatus(state.lang === 'ar'
                ? 'كلمة المرور يجب أن تكون 4 أحرف على الأقل'
                : 'Passcode must be at least 4 characters', true);
            return;
        }

        authCredentials.password = nextPasscode;
        saveCredentials();
        els.newPasscode.value = '';
        showStatus(state.lang === 'ar' ? 'تم تحديث كلمة المرور' : 'Passcode updated');
    }

    function toggleMode(targetMode) {
        const next = mode === targetMode ? 'none' : targetMode;
        setMode(next);
    }

    function setMode(nextMode) {
        mode = nextMode;
        clearHoverTarget();
        finishInlineEdit(true);

        document.body.classList.remove('cp-mode-text', 'cp-mode-image', 'cp-mode-delete');
        els.modeText.classList.remove('active');
        els.modeImage.classList.remove('active');
        els.modeDelete.classList.remove('active');

        if (mode === 'text') {
            document.body.classList.add('cp-mode-text');
            els.modeText.classList.add('active');
            showStatus(t('modeTextOn'));
            return;
        }

        if (mode === 'image') {
            document.body.classList.add('cp-mode-image');
            els.modeImage.classList.add('active');
            showStatus(t('modeImageOn'));
            return;
        }

        if (mode === 'delete') {
            document.body.classList.add('cp-mode-delete');
            els.modeDelete.classList.add('active');
            showStatus(t('modeDeleteOn'));
            return;
        }

        showStatus(t('modeOff'));
    }

    function handlePageClick(event) {
        if (mode === 'none') {
            return;
        }

        if (isControlPanelElement(event.target)) {
            return;
        }

        if (mode === 'text') {
            const target = event.target.closest('h1, h2, h3, h4, h5, h6, p, span, a, li, button, strong, em, b, small, label');
            if (!target || !isEditableTarget(target)) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            startInlineEdit(target);
            return;
        }

        if (mode === 'image') {
            const target = event.target.closest('img');
            if (!target || !isEditableTarget(target)) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            imageTarget = target;
            els.imageInput.value = '';
            els.imageInput.click();
            showStatus(t('chooseImage'));
            return;
        }

        if (mode === 'delete') {
            const target = resolveDeleteTarget(event.target);
            if (!target) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            if (!window.confirm(t('confirmDelete'))) {
                return;
            }
            const deleted = hideElement(target);
            if (deleted) {
                showStatus(t('itemDeleted'));
            }
        }
    }

    function handlePageHover(event) {
        if (mode === 'none') {
            return;
        }

        if (isControlPanelElement(event.target)) {
            clearHoverTarget();
            return;
        }

        let target = null;
        if (mode === 'text') {
            target = event.target.closest('h1, h2, h3, h4, h5, h6, p, span, a, li, button, strong, em, b, small, label');
        } else if (mode === 'image') {
            target = event.target.closest('img');
        } else if (mode === 'delete') {
            target = resolveDeleteTarget(event.target);
        }

        if (!target || !isEditableTarget(target)) {
            clearHoverTarget();
            return;
        }

        setHoverTarget(target);
    }

    function clearHoverIfNeeded(event) {
        if (!hoverTarget) {
            return;
        }
        if (event.target === hoverTarget || !hoverTarget.contains(event.relatedTarget)) {
            clearHoverTarget();
        }
    }

    function setHoverTarget(target) {
        if (hoverTarget === target) {
            return;
        }
        clearHoverTarget();
        hoverTarget = target;
        hoverTarget.classList.add('cp-hover-target');
    }

    function clearHoverTarget() {
        if (!hoverTarget) {
            return;
        }
        hoverTarget.classList.remove('cp-hover-target');
        hoverTarget = null;
    }

    function isControlPanelElement(target) {
        return !!target.closest('#cpPanel, #cpLoginModal, #cpLauncher, #cpOverlay');
    }

    function isNavbarTarget(target) {
        return !!(target && target.nodeType === 1 && target.closest('.header .navbar'));
    }

    function hasProtectedNavLink(target) {
        if (!target || target.nodeType !== 1) {
            return false;
        }
        if (target.matches('a.nav-link[data-nav-protected="true"]')) {
            return true;
        }
        if (target.closest('a.nav-link[data-nav-protected="true"]')) {
            return true;
        }
        return !!(target.querySelector && target.querySelector('a.nav-link[data-nav-protected="true"]'));
    }

    function restoreNavbarDefaults() {
        const navLinks = Array.from(document.querySelectorAll('.header .navbar a.nav-link[data-nav-protected="true"]'));
        navLinks.forEach((link) => {
            const defaultLabel = String(link.getAttribute('data-default-label') || '').trim();
            const defaultHref = String(link.getAttribute('data-default-href') || '').trim();
            const defaultIcon = String(link.getAttribute('data-default-icon') || '').trim();

            if (defaultHref) {
                link.setAttribute('href', defaultHref);
            }
            link.removeAttribute('target');
            link.removeAttribute('rel');

            const currentLabel = link.querySelector('.nav-label');
            const needsRebuild = !currentLabel || (defaultIcon && !link.querySelector('i'));

            if (needsRebuild) {
                link.textContent = '';
                if (defaultIcon) {
                    const icon = document.createElement('i');
                    icon.className = defaultIcon;
                    link.appendChild(icon);
                }
                const label = document.createElement('span');
                label.className = 'nav-label';
                label.textContent = defaultLabel;
                link.appendChild(label);
            } else if (defaultLabel) {
                currentLabel.textContent = defaultLabel;
            }
        });
    }

    function sanitizeNavbarOverrides() {
        let changed = false;

        const shouldStripSelector = (selector) => {
            const target = resolveStoredSelector(selector);
            return !!(target && hasProtectedNavLink(target));
        };

        const cleanMap = (source) => {
            const current = source && typeof source === 'object' ? source : {};
            const next = {};
            Object.entries(current).forEach(([selector, value]) => {
                if (shouldStripSelector(selector)) {
                    changed = true;
                    return;
                }
                next[selector] = value;
            });
            return next;
        };

        const hidden = Array.isArray(state.hiddenSelectors) ? state.hiddenSelectors : [];
        const nextHidden = hidden.filter((selector) => !shouldStripSelector(selector));
        if (nextHidden.length !== hidden.length) {
            state.hiddenSelectors = nextHidden;
            changed = true;
        } else if (!Array.isArray(state.hiddenSelectors)) {
            state.hiddenSelectors = nextHidden;
            changed = true;
        }

        const nextTextEdits = cleanMap(state.textEdits);
        if (Object.keys(nextTextEdits).length !== Object.keys(state.textEdits || {}).length) {
            state.textEdits = nextTextEdits;
            changed = true;
        } else if (!state.textEdits || typeof state.textEdits !== 'object') {
            state.textEdits = nextTextEdits;
            changed = true;
        }

        const nextLinkEdits = cleanMap(state.linkEdits);
        if (Object.keys(nextLinkEdits).length !== Object.keys(state.linkEdits || {}).length) {
            state.linkEdits = nextLinkEdits;
            changed = true;
        } else if (!state.linkEdits || typeof state.linkEdits !== 'object') {
            state.linkEdits = nextLinkEdits;
            changed = true;
        }

        if (changed) {
            saveState();
        }
    }

    function isEditableTarget(target) {
        if (!target) {
            return false;
        }
        if (isControlPanelElement(target)) {
            return false;
        }
        if (isNavbarTarget(target)) {
            return false;
        }
        const blockTags = new Set(['HTML', 'BODY', 'HEAD', 'SCRIPT', 'STYLE', 'META', 'LINK', 'TITLE']);
        return !blockTags.has(target.tagName);
    }

    function startInlineEdit(target) {
        if (editingTarget === target) {
            return;
        }
        finishInlineEdit(true);
        editingTarget = target;
        editingOriginal = target.innerHTML;

        target.contentEditable = 'true';
        target.classList.add('cp-editing-now');
        target.focus();
        moveCursorToEnd(target);

        target.addEventListener('keydown', onInlineEditKeyDown);
        target.addEventListener('blur', onInlineEditBlur, { once: true });
    }

    function onInlineEditKeyDown(event) {
        if (!editingTarget) {
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            cancelInlineEdit();
            return;
        }

        if (event.key === 'Enter' && !event.shiftKey) {
            if (editingTarget.matches('a, button, span, strong, em, b, small, label')) {
                event.preventDefault();
                editingTarget.blur();
            }
        }
    }

    function onInlineEditBlur() {
        finishInlineEdit(true);
    }

    function cancelInlineEdit() {
        if (!editingTarget) {
            return;
        }
        editingTarget.innerHTML = editingOriginal;
        finishInlineEdit(false);
    }

    function finishInlineEdit(saveChange) {
        if (!editingTarget) {
            return;
        }

        const target = editingTarget;
        target.removeEventListener('keydown', onInlineEditKeyDown);
        target.removeAttribute('contenteditable');
        target.classList.remove('cp-editing-now');

        if (saveChange) {
            const selector = getSelector(target);
            if (selector) {
                state.textEdits[selector] = target.innerHTML;
                saveState();
                showStatus(t('textSaved'));
            }
        }

        editingTarget = null;
        editingOriginal = '';
    }

    function moveCursorToEnd(el) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    async function handleImageSelected() {
        const file = els.imageInput.files && els.imageInput.files[0];
        if (!file || !imageTarget) {
            return;
        }

        if (!file.type || !file.type.startsWith('image/')) {
            showStatus(t('imageInvalid'), true);
            return;
        }

        await applyImageFileToTarget(file, imageTarget);
        renderImageEditor(state.imageSection);
    }

    async function handleAddImageUpload() {
        const file = els.addImageUploadInput && els.addImageUploadInput.files
            ? els.addImageUploadInput.files[0]
            : null;
        if (!file) {
            return;
        }

        if (!file.type || !file.type.startsWith('image/')) {
            showStatus(t('imageInvalid'), true);
            return;
        }

        try {
            pendingAddImageData = await getOptimizedImageDataUrl(file);
            if (els.addImage) {
                els.addImage.value = '';
            }
            if (els.addImageUploadName) {
                els.addImageUploadName.textContent = file.name;
            }
            showStatus(state.lang === 'ar' ? 'تم رفع الصورة للإضافة الجديدة' : 'Image attached to new item');
        } catch (error) {
            showStatus(t('imageInvalid'), true);
        } finally {
            if (els.addImageUploadInput) {
                els.addImageUploadInput.value = '';
            }
        }
    }

    async function handleAddFileUpload() {
        const file = els.addFileUploadInput && els.addFileUploadInput.files
            ? els.addFileUploadInput.files[0]
            : null;
        if (!file) {
            return;
        }

        const maxFileBytes = 2 * 1024 * 1024;
        if (file.size > maxFileBytes) {
            showStatus(
                state.lang === 'ar'
                    ? 'حجم الملف كبير. الحد الأقصى 2MB لكل ملف.'
                    : 'File is too large. Maximum 2MB per file.',
                true
            );
            if (els.addFileUploadInput) {
                els.addFileUploadInput.value = '';
            }
            return;
        }

        try {
            pendingAddFileData = await readFileAsDataUrl(file);
            pendingAddFileName = file.name || 'file';
            if (els.addFileUploadName) {
                els.addFileUploadName.textContent = pendingAddFileName;
            }
            showStatus(state.lang === 'ar' ? 'تم رفع الملف للإضافة الجديدة' : 'File attached to new item');
        } catch (error) {
            showStatus(
                state.lang === 'ar' ? 'تعذر قراءة الملف المرفوع' : 'Unable to read uploaded file',
                true
            );
        } finally {
            if (els.addFileUploadInput) {
                els.addFileUploadInput.value = '';
            }
        }
    }

    function resetPendingAddUploads() {
        pendingAddImageData = '';
        pendingAddFileData = '';
        pendingAddFileName = '';

        if (els.addImageUploadName) {
            els.addImageUploadName.textContent = state.lang === 'ar' ? 'لا توجد صورة مرفوعة' : 'No image uploaded';
        }
        if (els.addFileUploadName) {
            els.addFileUploadName.textContent = state.lang === 'ar' ? 'لا يوجد ملف مرفوع' : 'No file uploaded';
        }
        if (els.addImageUploadInput) {
            els.addImageUploadInput.value = '';
        }
        if (els.addFileUploadInput) {
            els.addFileUploadInput.value = '';
        }
    }

    function resolveDeleteTarget(start) {
        if (!start) {
            return null;
        }

        const node = start.nodeType === 1 ? start : start.parentElement;
        if (!node) {
            return null;
        }

        const prioritized = node.closest(
            '[data-cp-custom-id], .cp-generic-card, .featured-project-card-new, .certificate-card, .service-card-new, .experience-card, .experience-item, .edu-card, .edu-mini-card, .tool-item-with-carousel, .stat-card, .contact-item, .contact-card, .about-card, .project-card, .project-tech-tag'
        );

        if (prioritized && isEditableTarget(prioritized) && !isProtectedDeleteTarget(prioritized)) {
            return prioritized;
        }

        const target = node.closest(
            'img, a, button, p, span, li, h1, h2, h3, h4, h5, h6, small, strong, em, label, input, textarea, select, article, section, div'
        );

        if (!target || !isEditableTarget(target) || isProtectedDeleteTarget(target)) {
            return null;
        }

        if (target.classList.contains('nav-link')) {
            const navItem = target.closest('li');
            if (navItem && !isProtectedDeleteTarget(navItem)) {
                return navItem;
            }
        }

        return target;
    }

    function isProtectedDeleteTarget(target) {
        if (!target || target.nodeType !== 1) {
            return true;
        }

        if (target.closest('#cpPanel, #cpLoginModal, #cpOverlay')) {
            return true;
        }
        if (target.closest('.header')) {
            return true;
        }
        if (hasProtectedNavLink(target)) {
            return true;
        }

        const forbiddenIds = new Set(['particles-js', 'scrollProgressBar', 'cpLauncher', 'cpPanel', 'cpOverlay', 'cpLoginModal']);
        const forbiddenTags = new Set(['HTML', 'BODY', 'HEAD', 'SCRIPT', 'STYLE', 'META', 'LINK', 'TITLE']);
        if (forbiddenIds.has(target.id) || forbiddenTags.has(target.tagName)) {
            return true;
        }

        return false;
    }

    function hideElement(element) {
        if (!element || isProtectedDeleteTarget(element)) {
            return false;
        }

        const customCard = element.matches('[data-cp-custom-id]')
            ? element
            : element.closest('[data-cp-custom-id]');

        if (customCard) {
            return deleteCustomCard(customCard);
        }

        const selector = getSelector(element);
        element.classList.add('cp-user-hidden');
        if (selector && !state.hiddenSelectors.includes(selector)) {
            state.hiddenSelectors.push(selector);
            saveState();
        }
        return true;
    }

    function deleteCustomCard(item) {
        if (!item) {
            return false;
        }

        const customId = item.getAttribute('data-cp-custom-id');
        if (!customId) {
            return false;
        }

        const cardSelector = `[data-cp-custom-id="${cssEscape(customId)}"]`;
        item.remove();
        state.addedCards = (state.addedCards || []).filter((entry) => entry && entry.id !== customId);
        cleanupStateMapsByRootSelector(cardSelector);
        saveState();
        return true;
    }

    function deleteItemFromEditor(item) {
        if (!item) {
            return false;
        }

        if (item.hasAttribute('data-cp-custom-id')) {
            if (deleteCustomCard(item)) {
                return true;
            }
        }

        if (hideElement(item)) {
            return true;
        }

        return false;
    }

    function cleanupStateMapsByRootSelector(rootSelector) {
        if (!rootSelector) {
            return;
        }

        const shouldKeepKey = (key) => !(key === rootSelector || key.startsWith(`${rootSelector} >`));

        Object.keys(state.textEdits || {}).forEach((key) => {
            if (!shouldKeepKey(key)) {
                delete state.textEdits[key];
            }
        });

        Object.keys(state.linkEdits || {}).forEach((key) => {
            if (!shouldKeepKey(key)) {
                delete state.linkEdits[key];
            }
        });

        Object.keys(state.imageEdits || {}).forEach((key) => {
            if (!shouldKeepKey(key)) {
                delete state.imageEdits[key];
            }
        });

        if (Array.isArray(state.hiddenSelectors)) {
            state.hiddenSelectors = state.hiddenSelectors.filter((selector) => shouldKeepKey(selector));
        }
    }

    function restoreHiddenItems() {
        document.querySelectorAll('.cp-user-hidden').forEach((el) => el.classList.remove('cp-user-hidden'));
        state.hiddenSelectors = [];
        saveState();
        showStatus(t('restoreDone'));
    }

    function initValueEditor() {
        if (!els.valueSection || !els.valueList) {
            return;
        }

        const sections = getAvailableSections();
        const preferredSection = state.activeSectionId || state.valueSection;
        const currentValue = preferredSection && sections.some((section) => section.id === preferredSection)
            ? preferredSection
            : (sections[0] ? sections[0].id : '');

        els.valueSection.innerHTML = '';
        sections.forEach((section) => {
            const option = document.createElement('option');
            option.value = section.id;
            option.textContent = getSectionTitle(section);
            els.valueSection.appendChild(option);
        });

        if (currentValue) {
            els.valueSection.value = currentValue;
            state.valueSection = currentValue;
            state.activeSectionId = currentValue;
        }

        renderValueEditorFields(state.valueSection);
        renderSectionWorkspace(state.valueSection);
        renderSectionPreview(state.valueSection);
    }

    function renderValueEditorFields(sectionId) {
        if (!els.valueList) {
            return;
        }

        const section = sectionId ? document.getElementById(sectionId) : null;
        els.valueList.innerHTML = '';
        valueTargets = [];

        if (!section) {
            return;
        }

        const targets = collectValueTargets(section);
        valueTargets = targets;

        if (targets.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'cp-value-row';
            empty.textContent = t('valuesNoFields');
            els.valueList.appendChild(empty);
            return;
        }

        targets.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'cp-value-row';

            const title = document.createElement('div');
            title.className = 'cp-value-row-title';
            title.textContent = `${index + 1}. ${item.label}`;

            const input = document.createElement('textarea');
            input.className = 'cp-value-input cp-value-text-input';
            input.rows = 2;
            input.value = item.text;
            input.setAttribute('data-selector', item.selector);

            row.appendChild(title);
            row.appendChild(input);

            if (item.isLink) {
                const linkInput = document.createElement('input');
                linkInput.type = 'url';
                linkInput.className = 'cp-value-attr-input';
                linkInput.value = item.href || '';
                linkInput.placeholder = state.lang === 'ar' ? 'رابط العنصر (href)' : 'Element link (href)';
                linkInput.setAttribute('data-selector', item.selector);
                linkInput.setAttribute('data-attr', 'href');
                row.appendChild(linkInput);

                const fileTools = document.createElement('div');
                fileTools.className = 'cp-inline-actions cp-inline-actions-compact';

                const uploadFileBtn = document.createElement('button');
                uploadFileBtn.type = 'button';
                uploadFileBtn.className = 'cp-btn cp-btn-secondary';
                uploadFileBtn.textContent = state.lang === 'ar' ? 'رفع ملف للرابط' : 'Upload File to Link';

                const uploadInput = document.createElement('input');
                uploadInput.type = 'file';
                uploadInput.accept = '*/*';
                uploadInput.hidden = true;

                uploadFileBtn.addEventListener('click', () => uploadInput.click());
                uploadInput.addEventListener('change', async () => {
                    const file = uploadInput.files && uploadInput.files[0];
                    if (!file) {
                        return;
                    }
                    const maxFileBytes = 2 * 1024 * 1024;
                    if (file.size > maxFileBytes) {
                        showStatus(
                            state.lang === 'ar'
                                ? 'حجم الملف كبير. الحد الأقصى 2MB لكل ملف.'
                                : 'File is too large. Maximum 2MB per file.',
                            true
                        );
                        uploadInput.value = '';
                        return;
                    }

                    try {
                        const dataUrl = await readFileAsDataUrl(file);
                        linkInput.value = dataUrl;
                        showStatus(state.lang === 'ar' ? 'تم ربط الملف بالرابط' : 'File linked successfully');
                    } catch (error) {
                        showStatus(state.lang === 'ar' ? 'تعذر قراءة الملف' : 'Unable to read file', true);
                    } finally {
                        uploadInput.value = '';
                    }
                });

                fileTools.appendChild(uploadFileBtn);
                fileTools.appendChild(uploadInput);
                row.appendChild(fileTools);
            }

            els.valueList.appendChild(row);
        });
    }

    function collectValueTargets(section) {
        const selector = 'h1, h2, h3, h4, h5, h6, p, a, button, li, span, strong, em, b, small, label, figcaption';
        const nodes = Array.from(section.querySelectorAll(selector));
        const used = new Set();

        return nodes
            .filter((node) => {
                if (!isEditableTarget(node) || node.classList.contains('cp-hover-target') || node.classList.contains('cp-editing-now')) {
                    return false;
                }
                if (node.closest('.cp-panel, .cp-modal, .cp-launcher')) {
                    return false;
                }
                if (node.classList.contains('tooltip') || node.classList.contains('typing-cursor')) {
                    return false;
                }
                const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
                const hrefValue = node.tagName === 'A' ? ((node.getAttribute('href') || '').trim()) : '';
                if (text.length < 2 && !hrefValue) {
                    return false;
                }
                if (node.querySelector('input, textarea, select, video, iframe, canvas')) {
                    return false;
                }
                const selectorValue = getSelector(node);
                if (!selectorValue || used.has(selectorValue)) {
                    return false;
                }
                used.add(selectorValue);
                return true;
            })
            .slice(0, 420)
            .map((node) => {
                const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
                const href = node.tagName === 'A' ? ((node.getAttribute('href') || '').trim()) : '';
                const selectorValue = getSelector(node);
                const basePreview = text || href || (node.getAttribute('aria-label') || '').trim() || node.tagName.toLowerCase();
                const preview = basePreview.length > 44 ? `${basePreview.slice(0, 44)}...` : basePreview;
                return {
                    selector: selectorValue,
                    text,
                    label: `${node.tagName.toLowerCase()} | ${preview}`,
                    isLink: node.tagName === 'A',
                    href
                };
            });
    }

    function applyValueEditorChanges() {
        if (!els.valueList) {
            return;
        }

        const textInputs = Array.from(els.valueList.querySelectorAll('.cp-value-text-input'));
        const attrInputs = Array.from(els.valueList.querySelectorAll('.cp-value-attr-input'));
        if (textInputs.length === 0 && attrInputs.length === 0) {
            showStatus(t('valuesNoFields'), true);
            return;
        }

        let changeCount = 0;
        textInputs.forEach((input) => {
            const selectorValue = input.getAttribute('data-selector');
            if (!selectorValue) {
                return;
            }
            const target = resolveStoredSelector(selectorValue);
            if (!target || !isEditableTarget(target)) {
                return;
            }
            const nextValue = input.value.trim();
            if ((target.textContent || '').trim() === nextValue) {
                return;
            }
            target.textContent = nextValue;
            state.textEdits[selectorValue] = target.innerHTML;
            changeCount += 1;
        });

        attrInputs.forEach((input) => {
            const selectorValue = input.getAttribute('data-selector');
            const attrName = input.getAttribute('data-attr');
            if (!selectorValue || attrName !== 'href') {
                return;
            }
            const target = resolveStoredSelector(selectorValue);
            if (!target || target.tagName !== 'A') {
                return;
            }

            const nextValue = input.value.trim();
            const currentValue = (target.getAttribute('href') || '').trim();
            if (currentValue === nextValue) {
                return;
            }

            if (nextValue) {
                target.setAttribute('href', nextValue);
                if (/^https?:\/\//i.test(nextValue)) {
                    target.setAttribute('target', '_blank');
                    target.setAttribute('rel', 'noopener');
                }
            } else {
                target.removeAttribute('href');
                target.removeAttribute('target');
                target.removeAttribute('rel');
            }
            state.linkEdits[selectorValue] = nextValue;
            changeCount += 1;
        });

        if (changeCount > 0) {
            saveState();
            renderSectionManager();
            initValueEditor();
            renderQuickSectionTabs();
            activateDashboardTab(state.activeTab || 'section', {
                itemType: state.activeItemTypeTab || state.itemType || 'all',
                sectionId: state.activeSectionId || state.valueSection || 'home',
                persist: false
            });
            showStatus(t('valuesSaved'));
            return;
        }

        showStatus(t('valuesSaved'));
    }

    function initImageEditor() {
        if (!els.imageSection || !els.imageList) {
            return;
        }

        const sections = getAvailableSections();
        const preferredSection = state.activeSectionId || state.imageSection || state.valueSection;
        const currentValue = preferredSection && sections.some((section) => section.id === preferredSection)
            ? preferredSection
            : (sections[0] ? sections[0].id : '');

        els.imageSection.innerHTML = '';
        sections.forEach((section) => {
            const option = document.createElement('option');
            option.value = section.id;
            option.textContent = getSectionTitle(section);
            els.imageSection.appendChild(option);
        });

        if (currentValue) {
            els.imageSection.value = currentValue;
            state.imageSection = currentValue;
            state.activeSectionId = currentValue;
        }

        renderImageEditor(state.imageSection);
    }

    function renderImageEditor(sectionId) {
        if (!els.imageList) {
            return;
        }

        const section = sectionId ? document.getElementById(sectionId) : null;
        els.imageList.innerHTML = '';

        if (!section) {
            return;
        }

        const images = collectImageTargets(section);
        if (images.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'cp-value-row';
            empty.textContent = t('imageNoItems');
            els.imageList.appendChild(empty);
            return;
        }

        images.forEach((img, index) => {
            const row = document.createElement('div');
            row.className = 'cp-value-row cp-image-row';

            const title = document.createElement('div');
            title.className = 'cp-value-row-title';
            title.textContent = `${index + 1}. ${getImageLabel(img)}`;

            const preview = document.createElement('img');
            preview.className = 'cp-image-preview';
            preview.src = img.src;
            preview.alt = img.alt || `image-${index + 1}`;

            const controls = document.createElement('div');
            controls.className = 'cp-image-actions';

            const uploadBtn = document.createElement('button');
            uploadBtn.type = 'button';
            uploadBtn.className = 'cp-btn cp-btn-secondary';
            uploadBtn.textContent = t('imageUploadBtn');

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.hidden = true;

            uploadBtn.addEventListener('click', () => input.click());
            input.addEventListener('change', async () => {
                const file = input.files && input.files[0];
                if (!file) {
                    return;
                }
                await applyImageFileToTarget(file, img);
                preview.src = img.src;
                input.value = '';
            });

            controls.appendChild(uploadBtn);
            controls.appendChild(input);

            row.appendChild(title);
            row.appendChild(preview);
            row.appendChild(controls);
            els.imageList.appendChild(row);
        });
    }

    function collectImageTargets(section) {
        return Array.from(section.querySelectorAll('img'))
            .filter((img) => {
                if (!img.src) {
                    return false;
                }
                if (img.closest('#cpPanel, #cpLoginModal')) {
                    return false;
                }
                if (img.classList.contains('cp-image-preview')) {
                    return false;
                }
                return true;
            })
            .slice(0, 120);
    }

    function getImageLabel(img) {
        const heading = img.closest('.cp-generic-card, .featured-project-card-new, .certificate-card, .service-card-new, .edu-mini-card, .experience-card')
            ?.querySelector('h3, h4, h5');
        if (heading && heading.textContent) {
            return heading.textContent.trim();
        }

        if (img.alt && img.alt.trim()) {
            return img.alt.trim();
        }

        const srcName = (img.getAttribute('src') || '').split('/').pop();
        return srcName || 'Image';
    }

    async function applyImageFileToTarget(file, target) {
        if (!file || !target) {
            return;
        }

        if (!file.type || !file.type.startsWith('image/')) {
            showStatus(t('imageInvalid'), true);
            return;
        }

        try {
            const dataUrl = await getOptimizedImageDataUrl(file);
            target.src = dataUrl;
            target.removeAttribute('srcset');
            target.classList.add('cp-free-size-image');

            const selector = getSelector(target);
            if (selector) {
                state.imageEdits[selector] = dataUrl;
                saveState();
            }

            const parentSection = target.closest('.section-content[id]');
            if (parentSection && parentSection.id === state.activeSectionId) {
                renderSectionPreview(parentSection.id);
            }

            showStatus(t('imageSaved'));
        } catch (error) {
            showStatus(t('imageInvalid'), true);
        }
    }

    function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error || new Error('Read error'));
            reader.readAsDataURL(file);
        });
    }

    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Image load error'));
            img.src = url;
        });
    }

    async function getOptimizedImageDataUrl(file) {
        const rawDataUrl = await readFileAsDataUrl(file);
        const needsOptimization = file.size > (2 * 1024 * 1024);
        if (!needsOptimization) {
            return rawDataUrl;
        }

        const img = await loadImage(rawDataUrl);
        const maxDimension = 2200;
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        return canvas.toDataURL('image/jpeg', 0.88);
    }

    function renderSectionManager() {
        if (!els.sectionList) {
            return;
        }

        els.sectionList.innerHTML = '';
        const sections = getAvailableSections();

        sections.forEach((section) => {
            const row = document.createElement('label');
            row.className = 'cp-section-row';

            const text = document.createElement('span');
            text.textContent = getSectionTitle(section);

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.setAttribute('data-cp-section-toggle', section.id);
            input.checked = state.sectionVisibility[section.id] !== false;
            input.addEventListener('change', () => {
                setSectionVisibility(section.id, input.checked, true);
                if (section.id === state.activeSectionId) {
                    renderSectionWorkspace(section.id);
                }
            });

            row.appendChild(text);
            row.appendChild(input);
            els.sectionList.appendChild(row);
        });

        populateAddTargets();
        renderQuickSectionTabs();
        activateDashboardTab(state.activeTab || 'section', {
            itemType: state.activeItemTypeTab || state.itemType || 'all',
            sectionId: state.activeSectionId || state.valueSection || 'home',
            persist: false
        });
    }

    function getSectionTitle(section) {
        const navLink = section && section.id
            ? document.querySelector(`.nav-link[href="#${cssEscape(section.id)}"]`)
            : null;
        const navLabel = navLink
            ? ((navLink.getAttribute('data-default-label') || navLink.querySelector('.nav-label')?.textContent || '').trim())
            : '';
        if (navLabel) {
            return navLabel;
        }

        const heading = section.querySelector('h1, h2, h3');
        if (heading && heading.textContent) {
            return heading.textContent.trim();
        }
        return section.id.toUpperCase();
    }

    function renderSectionWorkspace(sectionId) {
        const section = sectionId ? document.getElementById(sectionId) : null;
        if (!section) {
            return;
        }

        const title = getSectionTitle(section);
        if (els.currentSectionTitle) {
            els.currentSectionTitle.textContent = title;
        }
        if (els.currentSectionDescription) {
            els.currentSectionDescription.textContent = state.lang === 'ar'
                ? `أنت الآن داخل قسم "${title}". كل أدوات هذا القسم مجمعة هنا لتعديل أسهل وأوضح.`
                : `You are editing "${title}". All tools for this section are grouped here for faster, cleaner editing.`;
        }
        if (els.valueSectionBadge) {
            els.valueSectionBadge.textContent = state.lang === 'ar'
                ? `حقول النص: ${title}`
                : `Text Fields: ${title}`;
        }
        if (els.imageSectionBadge) {
            els.imageSectionBadge.textContent = state.lang === 'ar'
                ? `صور القسم: ${title}`
                : `Section Images: ${title}`;
        }
        if (els.currentSectionVisibility) {
            els.currentSectionVisibility.checked = state.sectionVisibility[sectionId] !== false;
        }
    }

    function buildSectionPreviewClone(section) {
        const clone = section.cloneNode(true);
        clone.removeAttribute('id');
        clone.classList.remove('active-section');
        clone.classList.remove('reveal');
        clone.style.display = 'block';

        clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
        clone.querySelectorAll('script, style').forEach((node) => node.remove());
        clone.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((node) => node.classList.add('active'));
        clone.querySelectorAll('a').forEach((link) => {
            link.removeAttribute('href');
            link.removeAttribute('target');
            link.removeAttribute('rel');
        });
        clone.querySelectorAll('button, input, textarea, select').forEach((node) => {
            if ('disabled' in node) {
                node.disabled = true;
            }
        });

        return clone;
    }

    function renderSectionPreview(sectionId) {
        if (!els.sectionPreview) {
            return;
        }

        const section = sectionId ? document.getElementById(sectionId) : null;
        els.sectionPreview.innerHTML = '';
        if (!section) {
            return;
        }

        els.sectionPreview.appendChild(buildSectionPreviewClone(section));
    }

    function focusSectionEditors() {
        if (!els.panel) {
            return;
        }

        const activePanel = els.panel.querySelector('.cp-tab-panel.is-active[data-cp-tab-panel="section"]');
        const valueCard = els.valueList ? els.valueList.closest('.cp-card') : null;
        if (!activePanel || !valueCard) {
            return;
        }

        requestAnimationFrame(() => {
            const targetTop = Math.max(0, valueCard.offsetTop - 10);
            activePanel.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
        });
    }

    function openSiteSection(sectionId) {
        if (!sectionId) {
            return;
        }

        const navLink = document.querySelector(`.nav-link[href="#${cssEscape(sectionId)}"]`);
        if (navLink) {
            navLink.click();
        }

        closePanel();
    }

    function setSectionVisibility(sectionId, visible, persist) {
        const section = document.getElementById(sectionId);
        if (!section) {
            return;
        }

        section.classList.toggle('cp-section-hidden', !visible);
        const navLink = document.querySelector(`.nav-link[href="#${cssEscape(sectionId)}"]`);
        if (navLink) {
            navLink.classList.toggle('cp-nav-disabled', !visible);
        }

        if (persist) {
            state.sectionVisibility[sectionId] = visible;
            saveState();
        }

        if (!visible && section.classList.contains('active-section')) {
            const firstVisible = Array.from(document.querySelectorAll('main .section-content[id]'))
                .find((item) => !item.classList.contains('cp-section-hidden'));
            if (firstVisible) {
                const nextLink = document.querySelector(`.nav-link[href="#${cssEscape(firstVisible.id)}"]`);
                if (nextLink) {
                    nextLink.click();
                }
            }
        }
    }

    function populateAddTargets() {
        if (!els.addTarget) {
            return;
        }

        const previous = (els.addTarget.value || '').trim();
        const options = [];

        options.push({ value: 'projects', label: t('targetProjects') });
        options.push({ value: 'certificates', label: t('targetCertificates') });
        options.push({ value: 'services', label: t('targetServices') });

        const sectionPrefix = state.lang === 'ar' ? 'قسم: ' : 'Section: ';
        const sections = Array.from(document.querySelectorAll('main .section-content[id]'));
        sections.forEach((section) => {
            options.push({
                value: `section:${section.id}`,
                label: `${sectionPrefix}${getSectionTitle(section)}`
            });
        });

        els.addTarget.innerHTML = '';
        options.forEach((item) => {
            const option = document.createElement('option');
            option.value = item.value;
            option.textContent = item.label;
            els.addTarget.appendChild(option);
        });

        const hasPrevious = options.some((item) => item.value === previous);
        const fallback = options.some((item) => item.value === state.itemType) ? state.itemType : 'projects';
        els.addTarget.value = hasPrevious ? previous : fallback;
    }

    function handleAddCard(event) {
        event.preventDefault();
        const target = (els.addTarget.value || '').trim();
        const title = (els.addTitle.value || '').trim();
        const description = (els.addDescription.value || '').trim();
        const image = (pendingAddImageData || (els.addImage.value || '').trim());
        const link = (els.addLink.value || '').trim();
        const buttonLabel = (els.addButtonLabel.value || '').trim();
        const fileData = pendingAddFileData || '';
        const fileName = pendingAddFileName || '';
        const hasContent = !!(title || description || image || link || fileData);

        if (!hasContent) {
            showStatus(
                state.lang === 'ar'
                    ? 'أدخل قيمة واحدة على الأقل (عنوان، وصف، صورة، رابط أو ملف)'
                    : 'Enter at least one value (title, description, image, link, or file)',
                true
            );
            return;
        }

        const resolvedLink = link || fileData;
        const resolvedButton = buttonLabel || (fileData ? (state.lang === 'ar' ? 'تحميل الملف' : 'Download File') : '');
        const safeTitle = title || (state.lang === 'ar' ? 'عنصر جديد' : 'New Item');
        const safeDescription = description || (state.lang === 'ar' ? 'أضف وصف المحتوى هنا' : 'Write content description here...');

        const data = {
            id: `cp-item-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            target,
            title: safeTitle,
            description: safeDescription,
            image,
            link: resolvedLink,
            buttonLabel: resolvedButton,
            fileData,
            fileName
        };

        const inserted = insertCard(data);
        if (!inserted) {
            showStatus(t('addFail'), true);
            return;
        }

        state.addedCards.push(data);
        saveState();
        els.addForm.reset();
        resetPendingAddUploads();
        renderSectionManager();
        initImageEditor();

        const nextItemType = isSectionTarget(target) ? 'all' : (isItemTypeSupported(target) ? target : (state.itemType || 'all'));
        state.itemType = nextItemType;
        state.activeItemTypeTab = nextItemType;
        if (els.itemType && setSelectValue(els.itemType, nextItemType)) {
            els.itemType.value = nextItemType;
        }
        renderItemEditor(nextItemType);
        showStatus(t('addDone'));
    }

    function insertCard(data) {
        if (!data || !data.id || !data.target) {
            return false;
        }

        if (document.querySelector(`[data-cp-custom-id="${cssEscape(data.id)}"]`)) {
            return true;
        }

        const container = getTargetContainer(data.target);
        if (!container) {
            return false;
        }

        let card;
        if (data.target === 'projects') {
            card = buildProjectCard(data);
        } else if (data.target === 'certificates') {
            card = buildCertificateCard(data);
        } else if (data.target === 'services') {
            card = buildServiceCard(data);
        } else if (isSectionTarget(data.target)) {
            card = buildGenericSectionCard(data);
        } else {
            return false;
        }

        container.appendChild(card);
        return true;
    }

    function resolveCustomCardImage(source) {
        const raw = typeof source === 'string' ? source.trim() : '';
        if (!raw) {
            return '';
        }
        if (/^(data:image\/|blob:|https?:\/\/|\/|\.\/|assets\/)/i.test(raw)) {
            return raw;
        }
        return '';
    }

    function applySafeCardImage(img, source, altText) {
        if (!img) {
            return;
        }

        const safeAlt = typeof altText === 'string' && altText.trim()
            ? altText.trim()
            : 'Item image';
        const fallback = DEFAULT_CARD_IMAGE;
        const resolved = resolveCustomCardImage(source) || fallback;

        img.alt = safeAlt;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.addEventListener('error', () => {
            if (img.dataset.cpFallbackApplied === '1') {
                return;
            }
            img.dataset.cpFallbackApplied = '1';
            img.src = fallback;
            img.classList.add('cp-image-fallback');
        });
        img.src = resolved;
    }

    function buildProjectCard(data) {
        const card = document.createElement('div');
        card.className = 'featured-project-card-new cp-custom-card';
        card.setAttribute('data-cp-custom-id', data.id);

        const imageWrap = document.createElement('div');
        imageWrap.className = 'featured-project-image-new';
        const img = document.createElement('img');
        applySafeCardImage(img, data.image, data.title);
        imageWrap.appendChild(img);

        const info = document.createElement('div');
        info.className = 'featured-project-info-new';
        const title = document.createElement('h3');
        title.textContent = data.title;
        const desc = document.createElement('p');
        desc.textContent = data.description;

        const actions = document.createElement('div');
        actions.className = 'featured-project-buttons-new';

        if (data.link) {
            const button = document.createElement('a');
            button.href = data.link;
            button.target = '_blank';
            button.rel = 'noopener';
            button.className = 'btn-featured-primary-new magnetic-button';
            button.textContent = data.buttonLabel || 'Open';
            actions.appendChild(button);
        } else if (data.buttonLabel) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn-featured-primary-new magnetic-button';
            button.textContent = data.buttonLabel;
            actions.appendChild(button);
        }

        if (data.fileData && data.link && data.fileData !== data.link) {
            const fileButton = document.createElement('a');
            fileButton.href = data.fileData;
            fileButton.download = data.fileName || 'attachment';
            fileButton.className = 'btn-featured-primary-new magnetic-button';
            fileButton.textContent = state.lang === 'ar' ? 'تحميل الملف' : 'Download File';
            actions.appendChild(fileButton);
        }

        info.appendChild(title);
        info.appendChild(desc);
        info.appendChild(actions);

        card.appendChild(imageWrap);
        card.appendChild(info);
        return card;
    }

    function buildCertificateCard(data) {
        const card = document.createElement('div');
        card.className = 'certificate-card cp-custom-card';
        card.setAttribute('data-cp-custom-id', data.id);

        const imageWrap = document.createElement('div');
        imageWrap.className = 'certificate-image cert-img-box';
        const img = document.createElement('img');
        applySafeCardImage(img, data.image, data.title);
        imageWrap.appendChild(img);

        const info = document.createElement('div');
        info.className = 'certificate-info';
        const heading = document.createElement('h4');
        heading.textContent = data.title;
        const org = document.createElement('p');
        org.className = 'cert-organization';
        org.textContent = data.organization || 'Organization';
        const desc = document.createElement('p');
        desc.className = 'cert-description';
        desc.textContent = data.description;
        const tag = document.createElement('span');
        tag.className = 'cert-tag';
        tag.textContent = data.tag || 'CUSTOM';

        info.appendChild(heading);
        info.appendChild(org);
        info.appendChild(desc);
        info.appendChild(tag);

        card.appendChild(imageWrap);
        card.appendChild(info);
        return card;
    }

    function buildServiceCard(data) {
        const card = document.createElement('div');
        card.className = 'service-card-new cp-custom-card';
        card.setAttribute('data-cp-custom-id', data.id);

        const imageWrap = document.createElement('div');
        imageWrap.className = 'service-image-new';
        const img = document.createElement('img');
        applySafeCardImage(img, data.image, data.title);
        imageWrap.appendChild(img);

        const heading = document.createElement('h3');
        heading.textContent = data.title;

        const desc = document.createElement('p');
        desc.textContent = data.description;

        card.appendChild(imageWrap);
        card.appendChild(heading);
        card.appendChild(desc);

        if (data.link) {
            const linkButton = document.createElement('a');
            linkButton.href = data.link;
            linkButton.target = '_blank';
            linkButton.rel = 'noopener';
            linkButton.className = 'btn-featured-primary-new magnetic-button';
            linkButton.style.display = 'inline-flex';
            linkButton.style.marginTop = '12px';
            linkButton.textContent = data.buttonLabel || 'Open';
            card.appendChild(linkButton);
        }

        if (data.fileData && data.link && data.fileData !== data.link) {
            const fileButton = document.createElement('a');
            fileButton.href = data.fileData;
            fileButton.download = data.fileName || 'attachment';
            fileButton.className = 'btn-featured-primary-new magnetic-button';
            fileButton.style.display = 'inline-flex';
            fileButton.style.marginTop = '10px';
            fileButton.textContent = state.lang === 'ar' ? 'تحميل الملف' : 'Download File';
            card.appendChild(fileButton);
        }

        return card;
    }

    function buildGenericSectionCard(data) {
        const card = document.createElement('article');
        card.className = 'cp-generic-card cp-custom-card';
        card.setAttribute('data-cp-custom-id', data.id);
        card.setAttribute('data-cp-generic', '1');

        if (data.image) {
            const image = document.createElement('img');
            image.className = 'cp-generic-image';
            applySafeCardImage(image, data.image, data.title || 'Custom item');
            card.appendChild(image);
        }

        const heading = document.createElement('h3');
        heading.className = 'cp-generic-title';
        heading.textContent = data.title || 'New Item';

        const desc = document.createElement('p');
        desc.className = 'cp-generic-description';
        desc.textContent = data.description || '';

        card.appendChild(heading);
        card.appendChild(desc);

        if (data.link || data.buttonLabel || data.fileData) {
            const linkBtn = document.createElement('a');
            linkBtn.className = 'cp-generic-link';
            linkBtn.textContent = data.buttonLabel || (state.lang === 'ar' ? 'عرض التفاصيل' : 'View Details');
            linkBtn.href = data.link || data.fileData || '#';
            if (data.link && /^https?:\/\//i.test(data.link)) {
                linkBtn.target = '_blank';
                linkBtn.rel = 'noopener';
            }
            if (data.fileData && (!data.link || data.link === data.fileData)) {
                linkBtn.download = data.fileName || 'attachment';
            }
            card.appendChild(linkBtn);
        }

        if (data.fileData && data.link && data.link !== data.fileData) {
            const fileBtn = document.createElement('a');
            fileBtn.className = 'cp-generic-link';
            fileBtn.href = data.fileData;
            fileBtn.download = data.fileName || 'attachment';
            fileBtn.textContent = state.lang === 'ar' ? 'تحميل الملف' : 'Download File';
            card.appendChild(fileBtn);
        }

        return card;
    }

    function isSectionTarget(target) {
        return typeof target === 'string' && target.startsWith('section:');
    }

    function getTargetContainer(target) {
        if (target === 'projects') {
            return document.querySelector('.featured-projects-grid-new');
        }
        if (target === 'certificates') {
            return document.querySelector('.certificates-grid');
        }
        if (target === 'services') {
            return document.querySelector('.services-grid-new');
        }
        if (isSectionTarget(target)) {
            const sectionId = target.slice('section:'.length);
            return getSectionHostContainer(sectionId);
        }
        return null;
    }

    function getSectionHostContainer(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) {
            return null;
        }

        const host =
            section.querySelector(':scope > .container:last-of-type') ||
            section.querySelector('.container:last-of-type') ||
            section.querySelector('.about-container, .contact-container, .skills-wrapper, .education-wrapper') ||
            section;

        if (!host) {
            return section;
        }

        let genericZone = host.querySelector(':scope > .cp-generic-zone');
        if (!genericZone) {
            genericZone = document.createElement('div');
            genericZone.className = 'cp-generic-zone';
            host.appendChild(genericZone);
        }
        return genericZone;
    }

    function initItemEditor() {
        if (!els.itemType || !els.itemList) {
            return;
        }

        const allowed = ['all', 'certificates', 'projects', 'services'];
        const currentValue = allowed.includes(state.activeItemTypeTab)
            ? state.activeItemTypeTab
            : (allowed.includes(state.itemType) ? state.itemType : 'all');
        els.itemType.value = currentValue;
        state.itemType = currentValue;
        state.activeItemTypeTab = currentValue;
        renderItemEditor(currentValue);
    }

    function getItemsByType(type) {
        if (type === 'all') {
            return Array.from(document.querySelectorAll(
                '.cp-generic-card, .featured-project-card-new, .certificate-card, .service-card-new, .experience-card, .experience-item, .edu-card, .edu-mini-card, .about-card, .contact-item, .contact-card, .tool-item-with-carousel, .stat-card'
            ));
        }
        if (type === 'certificates') {
            return Array.from(document.querySelectorAll('.certificate-card'));
        }
        if (type === 'projects') {
            return Array.from(document.querySelectorAll('.featured-project-card-new'));
        }
        if (type === 'services') {
            return Array.from(document.querySelectorAll('.service-card-new'));
        }
        return [];
    }

    function getItemTitle(type, item) {
        if (type === 'all') {
            return (item.querySelector('.cp-generic-title, h1, h2, h3, h4, h5, h6')?.textContent || '').trim();
        }
        if (type === 'certificates') {
            return (item.querySelector('.certificate-info h4')?.textContent || '').trim();
        }
        if (type === 'projects') {
            return (item.querySelector('.featured-project-info-new h3')?.textContent || '').trim();
        }
        if (type === 'services') {
            return (item.querySelector('h3')?.textContent || '').trim();
        }
        return '';
    }

    function getItemImage(type, item) {
        if (type === 'all') {
            return item.querySelector('img');
        }
        if (type === 'certificates') {
            return item.querySelector('.certificate-image img, .cert-img-box img');
        }
        if (type === 'projects') {
            return item.querySelector('.featured-project-image-new img');
        }
        if (type === 'services') {
            return item.querySelector('.service-image-new img');
        }
        return null;
    }

    function getItemFields(type, item) {
        if (type === 'all') {
            const heading = item.querySelector('.cp-generic-title, h1, h2, h3, h4, h5, h6');
            const description = item.querySelector('.cp-generic-description, p, li, span');
            const action = item.querySelector('.cp-generic-link, a, button');

            const fields = [];
            if (heading) {
                fields.push({ key: 'fieldTitle', target: heading, multiline: false });
            }
            if (description) {
                fields.push({ key: 'fieldDescription', target: description, multiline: true });
            }
            if (action) {
                fields.push({ key: 'fieldButtonLabel', target: action, multiline: false });
                if (action.tagName === 'A') {
                    fields.push({ key: 'fieldButtonUrl', target: action, multiline: false, attribute: 'href' });
                }
            }
            return fields;
        }

        if (type === 'certificates') {
            return [
                { key: 'fieldTitle', target: item.querySelector('.certificate-info h4'), multiline: false },
                { key: 'fieldOrganization', target: item.querySelector('.cert-organization'), multiline: false },
                { key: 'fieldDescription', target: item.querySelector('.cert-description'), multiline: true },
                { key: 'fieldTag', target: item.querySelector('.cert-tag'), multiline: false }
            ].filter((field) => field.target);
        }

        if (type === 'projects') {
            const action = item.querySelector('.featured-project-buttons-new a, .featured-project-buttons-new button');
            const fields = [
                { key: 'fieldTitle', target: item.querySelector('.featured-project-info-new h3'), multiline: false },
                { key: 'fieldDescription', target: item.querySelector('.featured-project-info-new p'), multiline: true }
            ];
            if (action) {
                fields.push({ key: 'fieldButtonLabel', target: action, multiline: false });
                if (action.tagName === 'A') {
                    fields.push({ key: 'fieldButtonUrl', target: action, multiline: false, attribute: 'href' });
                }
            }
            return fields.filter((field) => field.target);
        }

        if (type === 'services') {
            const action = item.querySelector('a.btn-featured-primary-new, a, button');
            const fields = [
                { key: 'fieldTitle', target: item.querySelector('h3'), multiline: false },
                { key: 'fieldDescription', target: item.querySelector('p'), multiline: true }
            ];
            if (action) {
                fields.push({ key: 'fieldButtonLabel', target: action, multiline: false });
                if (action.tagName === 'A') {
                    fields.push({ key: 'fieldButtonUrl', target: action, multiline: false, attribute: 'href' });
                }
            }
            return fields.filter((field) => field.target);
        }

        return [];
    }

    function renderItemEditor(type) {
        if (!els.itemList) {
            return;
        }

        els.itemList.innerHTML = '';
        const items = getItemsByType(type);

        if (items.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'cp-value-row';
            empty.textContent = t('itemNoItems');
            els.itemList.appendChild(empty);
            return;
        }

        items.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'cp-item-row';

            const head = document.createElement('button');
            head.type = 'button';
            head.className = 'cp-item-head';
            const title = getItemTitle(type, item) || `${index + 1}`;
            head.textContent = `${index + 1}. ${title}`;

            const body = document.createElement('div');
            body.className = 'cp-item-body';

            const fields = getItemFields(type, item);
            fields.forEach((field) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'cp-item-field';

                const label = document.createElement('label');
                label.textContent = t(field.key);

                const input = document.createElement(field.multiline ? 'textarea' : 'input');
                if (!field.multiline) {
                    input.type = 'text';
                }
                const selector = getSelector(field.target);
                input.setAttribute('data-selector', selector);
                if (field.attribute) {
                    input.setAttribute('data-attr', field.attribute);
                    input.value = (field.target.getAttribute(field.attribute) || '').trim();
                } else {
                    input.value = (field.target.textContent || '').trim();
                }

                wrapper.appendChild(label);
                wrapper.appendChild(input);
                body.appendChild(wrapper);
            });

            const imageTarget = getItemImage(type, item);
            if (imageTarget) {
                const imgWrap = document.createElement('div');
                imgWrap.className = 'cp-item-field';

                const imgLabel = document.createElement('label');
                imgLabel.textContent = 'Image';

                const imgPreview = document.createElement('img');
                imgPreview.className = 'cp-image-preview';
                imgPreview.src = imageTarget.src;
                imgPreview.alt = imageTarget.alt || title;

                const actions = document.createElement('div');
                actions.className = 'cp-item-actions';

                const uploadBtn = document.createElement('button');
                uploadBtn.type = 'button';
                uploadBtn.className = 'cp-btn cp-btn-secondary';
                uploadBtn.textContent = t('imageUploadBtn');

                const uploadInput = document.createElement('input');
                uploadInput.type = 'file';
                uploadInput.accept = 'image/*';
                uploadInput.hidden = true;

                uploadBtn.addEventListener('click', () => uploadInput.click());
                uploadInput.addEventListener('change', async () => {
                    const file = uploadInput.files && uploadInput.files[0];
                    if (!file) {
                        return;
                    }
                    await applyImageFileToTarget(file, imageTarget);
                    imgPreview.src = imageTarget.src;
                    uploadInput.value = '';
                });

                actions.appendChild(uploadBtn);
                actions.appendChild(uploadInput);
                imgWrap.appendChild(imgLabel);
                imgWrap.appendChild(imgPreview);
                imgWrap.appendChild(actions);
                body.appendChild(imgWrap);
            }

            const saveActions = document.createElement('div');
            saveActions.className = 'cp-item-actions';

            const saveBtn = document.createElement('button');
            saveBtn.type = 'button';
            saveBtn.className = 'cp-btn cp-btn-primary';
            saveBtn.textContent = t('itemSaveBtn');
            saveBtn.addEventListener('click', () => {
                const inputs = Array.from(body.querySelectorAll('[data-selector]'));
                let changed = 0;

                inputs.forEach((input) => {
                    const selector = input.getAttribute('data-selector');
                    const attrName = input.getAttribute('data-attr') || '';
                    if (!selector) {
                        return;
                    }
                    const target = resolveStoredSelector(selector);
                    if (!target || !isEditableTarget(target)) {
                        return;
                    }
                    const nextValue = input.value.trim();

                    if (attrName) {
                        const currentAttr = (target.getAttribute(attrName) || '').trim();
                        if (currentAttr === nextValue) {
                            return;
                        }
                        if (nextValue) {
                            target.setAttribute(attrName, nextValue);
                            if (target.tagName === 'A' && attrName === 'href' && /^https?:\/\//i.test(nextValue)) {
                                target.setAttribute('target', '_blank');
                                target.setAttribute('rel', 'noopener');
                            }
                        } else {
                            target.removeAttribute(attrName);
                            if (target.tagName === 'A' && attrName === 'href') {
                                target.removeAttribute('target');
                                target.removeAttribute('rel');
                            }
                        }
                        if (attrName === 'href') {
                            state.linkEdits[selector] = nextValue;
                        }
                        changed += 1;
                        return;
                    }

                    if ((target.textContent || '').trim() === nextValue) {
                        return;
                    }
                    target.textContent = nextValue;
                    state.textEdits[selector] = target.innerHTML;
                    changed += 1;
                });

                if (changed > 0) {
                    saveState();
                    const updatedTitle = getItemTitle(type, item) || `${index + 1}`;
                    head.textContent = `${index + 1}. ${updatedTitle}`;
                }
                showStatus(t('itemSaved'));
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'cp-btn cp-btn-danger';
            deleteBtn.textContent = state.lang === 'ar' ? 'حذف العنصر' : 'Delete Item';
            deleteBtn.addEventListener('click', () => {
                const confirmed = window.confirm(
                    state.lang === 'ar'
                        ? 'هل تريد حذف هذا العنصر؟'
                        : 'Do you want to delete this item?'
                );
                if (!confirmed) {
                    return;
                }

                deleteItemFromEditor(item);
                renderSectionManager();
                initValueEditor();
                initImageEditor();
                renderItemEditor(type);
                showStatus(state.lang === 'ar' ? 'تم حذف العنصر' : 'Item deleted');
            });

            saveActions.appendChild(saveBtn);
            saveActions.appendChild(deleteBtn);
            body.appendChild(saveActions);

            head.addEventListener('click', () => {
                row.classList.toggle('open');
            });

            row.appendChild(head);
            row.appendChild(body);
            els.itemList.appendChild(row);
        });
    }

    function addNewItemFromEditor() {
        const type = (els.itemType && els.itemType.value) || 'certificates';
        const stamp = Date.now();
        const defaultSection = state.valueSection || (document.querySelector('main .section-content[id]')?.id || 'home');
        const normalizedTarget = type === 'all' ? `section:${defaultSection}` : type;

        const data = {
            id: `cp-item-${stamp}-${Math.floor(Math.random() * 10000)}`,
            target: normalizedTarget,
            title: type === 'certificates'
                ? 'New Certificate'
                : (type === 'projects'
                    ? 'New Project'
                    : (type === 'services'
                        ? 'New Service'
                        : 'New Section Item')),
            description: type === 'certificates'
                ? 'Write your certificate details here...'
                : (type === 'projects'
                    ? 'Write your project details here...'
                    : (type === 'services'
                        ? 'Write your service details here...'
                        : 'Write your section item details here...')),
            image: '',
            link: '',
            buttonLabel: type === 'projects' ? 'Open' : ''
        };

        if (type === 'certificates') {
            data.organization = 'Organization';
            data.tag = 'NEW';
        }

        const inserted = insertCard(data);
        if (!inserted) {
            showStatus(t('addFail'), true);
            return;
        }

        state.addedCards.push(data);
        saveState();

        renderSectionManager();
        initImageEditor();
        renderItemEditor(type === 'all' ? 'all' : type);
        showStatus(t('itemAdded'));
    }

    function exportBackup() {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'portfolio-control-panel-backup.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        showStatus(t('backupExported'));
    }

    function importBackup() {
        const file = els.importInput.files && els.importInput.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result);
                state = normalizeState(parsed);
                saveState();
                showStatus(t('backupImported'));
                window.location.reload();
            } catch (error) {
                showStatus(t('importFail'), true);
            } finally {
                els.importInput.value = '';
            }
        };
        reader.readAsText(file);
    }

    function resetAllChanges() {
        if (!window.confirm(t('confirmReset'))) {
            return;
        }
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_LIGHT_KEY);
        localStorage.removeItem(STORAGE_ADDED_KEY);
        localStorage.removeItem(AUTH_CREDENTIALS_KEY);
        state = DEFAULT_STATE();
        authCredentials = { ...DEFAULT_AUTH };
        showStatus(t('resetDone'));
        window.location.reload();
    }

    function applyState() {
        applyAddedCards();
        applyTextEdits();
        applyLinkEdits();
        applyImageEdits();
        applyHiddenItems();
        applySectionVisibility();
        restoreNavbarDefaults();
    }

    function applyAddedCards() {
        if (!Array.isArray(state.addedCards)) {
            state.addedCards = [];
        }
        state.addedCards.forEach((item) => {
            insertCard(item);
        });
    }

    function applyTextEdits() {
        const entries = Object.entries(state.textEdits || {});
        entries.forEach(([selector, value]) => {
            const target = resolveStoredSelector(selector);
            if (target && isEditableTarget(target)) {
                target.innerHTML = value;
            }
        });
    }

    function applyLinkEdits() {
        const entries = Object.entries(state.linkEdits || {});
        entries.forEach(([selector, value]) => {
            const target = resolveStoredSelector(selector);
            if (!target || target.tagName !== 'A' || hasProtectedNavLink(target)) {
                return;
            }
            const nextValue = String(value || '').trim();
            if (!nextValue) {
                target.removeAttribute('href');
                return;
            }
            target.setAttribute('href', nextValue);
            if (/^https?:\/\//i.test(nextValue)) {
                target.setAttribute('target', '_blank');
                target.setAttribute('rel', 'noopener');
            }
        });
    }

    function applyImageEdits() {
        const entries = Object.entries(state.imageEdits || {});
        entries.forEach(([selector, value]) => {
            const target = resolveStoredSelector(selector);
            if (target && target.tagName === 'IMG') {
                target.src = value;
                target.removeAttribute('srcset');
                target.classList.add('cp-free-size-image');
            }
        });
    }

    function applyHiddenItems() {
        if (!Array.isArray(state.hiddenSelectors)) {
            state.hiddenSelectors = [];
        }
        state.hiddenSelectors.forEach((selector) => {
            const target = resolveStoredSelector(selector);
            if (target && isEditableTarget(target)) {
                target.classList.add('cp-user-hidden');
            }
        });
    }

    function applySectionVisibility() {
        Object.entries(state.sectionVisibility || {}).forEach(([sectionId, visible]) => {
            setSectionVisibility(sectionId, visible !== false, false);
        });
    }

    function getSelector(element) {
        if (!element || !element.tagName) {
            return '';
        }

        if (element.id) {
            return `#${cssEscape(element.id)}`;
        }

        if (element.hasAttribute('data-cp-custom-id')) {
            return `[data-cp-custom-id="${cssEscape(element.getAttribute('data-cp-custom-id'))}"]`;
        }

        const anchored = getAnchoredSelector(element);
        if (anchored) {
            return anchored;
        }

        const path = [];
        let current = element;

        while (current && current.nodeType === 1 && current !== document.body) {
            let selector = current.nodeName.toLowerCase();

            if (current.parentElement) {
                const siblings = Array.from(current.parentElement.children)
                    .filter((child) => child.nodeName === current.nodeName);
                if (siblings.length > 1) {
                    selector += `:nth-of-type(${siblings.indexOf(current) + 1})`;
                }
            }

            path.unshift(selector);
            current = current.parentElement;
        }

        return `body > ${path.join(' > ')}`;
    }

    function getAnchoredSelector(element) {
        if (!element || !element.parentElement) {
            return '';
        }

        let anchor = element.parentElement;
        while (anchor && anchor !== document.body) {
            if (anchor.id) {
                break;
            }
            anchor = anchor.parentElement;
        }

        if (!anchor || !anchor.id) {
            return '';
        }

        const path = [];
        let current = element;
        while (current && current !== anchor) {
            const parent = current.parentElement;
            if (!parent) {
                return '';
            }
            const index = Array.from(parent.children).indexOf(current) + 1;
            path.unshift(`${current.nodeName.toLowerCase()}:nth-child(${index})`);
            current = parent;
        }

        const anchorSelector = `#${cssEscape(anchor.id)}`;
        if (path.length === 0) {
            return anchorSelector;
        }
        return `${anchorSelector} > ${path.join(' > ')}`;
    }

    function resolveStoredSelector(selector) {
        if (!selector || typeof selector !== 'string') {
            return null;
        }

        const direct = safeQuerySelector(selector);
        if (direct) {
            return direct;
        }

        const simplified = simplifySelector(selector);
        if (simplified && simplified !== selector) {
            const bySimplified = safeQuerySelector(simplified);
            if (bySimplified) {
                return bySimplified;
            }
        }

        const normalizedNth = selector.replace(/:nth-of-type\(/g, ':nth-child(');
        if (normalizedNth !== selector) {
            const byNthChild = safeQuerySelector(normalizedNth);
            if (byNthChild) {
                return byNthChild;
            }
        }

        return null;
    }

    function simplifySelector(selector) {
        const parts = selector.split('>').map((part) => part.trim()).filter(Boolean);
        if (parts.length === 0) {
            return selector;
        }

        const simplifiedParts = parts.map((part) => {
            if (part.startsWith('#') || part.startsWith('[') || part.startsWith(':')) {
                return part;
            }
            return part.replace(/\.[a-zA-Z0-9_-]+/g, '');
        });

        return simplifiedParts.join(' > ');
    }

    function safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            return null;
        }
    }

    function migrateStoredSelectors() {
        let changed = false;

        const migrateMap = (sourceMap, validator) => {
            const next = {};
            Object.entries(sourceMap || {}).forEach(([oldSelector, value]) => {
                const target = resolveStoredSelector(oldSelector);
                if (!target || (validator && !validator(target))) {
                    next[oldSelector] = value;
                    return;
                }
                const newSelector = getSelector(target) || oldSelector;
                next[newSelector] = value;
                if (newSelector !== oldSelector) {
                    changed = true;
                }
            });
            return next;
        };

        const migrateArray = (sourceArray, validator) => {
            const next = [];
            (sourceArray || []).forEach((oldSelector) => {
                const target = resolveStoredSelector(oldSelector);
                if (!target || (validator && !validator(target))) {
                    if (!next.includes(oldSelector)) {
                        next.push(oldSelector);
                    }
                    return;
                }
                const newSelector = getSelector(target) || oldSelector;
                if (!next.includes(newSelector)) {
                    next.push(newSelector);
                }
                if (newSelector !== oldSelector) {
                    changed = true;
                }
            });
            return next;
        };

        state.textEdits = migrateMap(state.textEdits, (target) => isEditableTarget(target));
        state.linkEdits = migrateMap(state.linkEdits, (target) => target.tagName === 'A');
        state.imageEdits = migrateMap(state.imageEdits, (target) => target.tagName === 'IMG');
        state.hiddenSelectors = migrateArray(state.hiddenSelectors, (target) => isEditableTarget(target));

        if (changed) {
            saveState();
        }
    }

    function cssEscape(value) {
        if (window.CSS && typeof window.CSS.escape === 'function') {
            return window.CSS.escape(value);
        }
        return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
    }

    function applyLanguage(lang) {
        state.lang = lang === 'en' ? 'en' : 'ar';

        document.querySelectorAll('[data-i18n]').forEach((node) => {
            const key = node.getAttribute('data-i18n');
            if (!key || !TEXT[state.lang][key]) {
                return;
            }
            node.textContent = TEXT[state.lang][key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
            const key = node.getAttribute('data-i18n-placeholder');
            if (!key || !TEXT[state.lang][key]) {
                return;
            }
            node.placeholder = TEXT[state.lang][key];
        });

        const isArabic = state.lang === 'ar';
        els.panel.classList.toggle('cp-lang-ar', isArabic);
        els.loginModal.classList.toggle('cp-lang-ar', isArabic);
        if (els.adminToolsToggle) {
            els.adminToolsToggle.textContent = state.adminToolsExpanded === true ? t('adminToolsHide') : t('adminToolsShow');
        }
    }

    function t(key) {
        const langPack = TEXT[state.lang] || TEXT.ar;
        return langPack[key] || key;
    }

    function showStatus(message, isError = false) {
        if (!els.status) {
            return;
        }
        els.status.textContent = message;
        els.status.classList.toggle('error', isError);

        if (statusTimer) {
            clearTimeout(statusTimer);
        }
        statusTimer = setTimeout(() => {
            els.status.textContent = '';
            els.status.classList.remove('error');
        }, 3200);
    }

    function loadState() {
        const primary = readStorageJson(STORAGE_KEY);
        const light = readStorageJson(STORAGE_LIGHT_KEY);
        const addedCards = readStorageJson(STORAGE_ADDED_KEY);

        const source = primary || light || DEFAULT_STATE();
        const next = normalizeState(source);

        if (Array.isArray(addedCards)) {
            next.addedCards = addedCards;
        }

        return next;
    }

    function normalizeState(candidate) {
        const base = DEFAULT_STATE();
        if (!candidate || typeof candidate !== 'object') {
            return base;
        }
        base.lang = candidate.lang === 'en' ? 'en' : 'ar';
        base.textEdits = candidate.textEdits && typeof candidate.textEdits === 'object' ? candidate.textEdits : {};
        base.linkEdits = candidate.linkEdits && typeof candidate.linkEdits === 'object' ? candidate.linkEdits : {};
        base.imageEdits = candidate.imageEdits && typeof candidate.imageEdits === 'object' ? candidate.imageEdits : {};
        base.hiddenSelectors = Array.isArray(candidate.hiddenSelectors) ? candidate.hiddenSelectors : [];
        base.sectionVisibility = candidate.sectionVisibility && typeof candidate.sectionVisibility === 'object'
            ? candidate.sectionVisibility
            : {};
        base.addedCards = Array.isArray(candidate.addedCards) ? candidate.addedCards : [];
        base.valueSection = typeof candidate.valueSection === 'string' ? candidate.valueSection : 'home';
        base.imageSection = typeof candidate.imageSection === 'string'
            ? candidate.imageSection
            : (base.valueSection || 'home');
        base.itemType = typeof candidate.itemType === 'string' ? candidate.itemType : 'all';
        base.activeTab = typeof candidate.activeTab === 'string'
            ? (candidate.activeTab === 'profile' ? 'section' : candidate.activeTab)
            : 'section';
        base.activeItemTypeTab = typeof candidate.activeItemTypeTab === 'string'
            ? candidate.activeItemTypeTab
            : 'all';
        base.activeSectionId = typeof candidate.activeSectionId === 'string'
            ? candidate.activeSectionId
            : (base.valueSection || base.imageSection || 'home');
        base.adminToolsExpanded = candidate.adminToolsExpanded === true;
        return base;
    }

    function loadCredentials() {
        try {
            const raw = localStorage.getItem(AUTH_CREDENTIALS_KEY);
            if (!raw) {
                return { ...DEFAULT_AUTH };
            }
            const parsed = JSON.parse(raw);
            const username = parsed && typeof parsed.username === 'string' && parsed.username.trim()
                ? parsed.username.trim()
                : DEFAULT_AUTH.username;
            const password = parsed && typeof parsed.password === 'string' && parsed.password.trim()
                ? parsed.password.trim()
                : DEFAULT_AUTH.password;
            return { username, password };
        } catch (error) {
            return { ...DEFAULT_AUTH };
        }
    }

    function saveCredentials() {
        try {
            localStorage.setItem(AUTH_CREDENTIALS_KEY, JSON.stringify(authCredentials));
        } catch (error) {
            showStatus(t('storageLimit'), true);
        }
    }

    function readStorageJson(key) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) {
                return null;
            }
            return JSON.parse(raw);
        } catch (error) {
            return null;
        }
    }

    function buildLightStateSnapshot(current) {
        const safe = normalizeState(current || DEFAULT_STATE());
        return {
            lang: safe.lang,
            textEdits: safe.textEdits,
            linkEdits: safe.linkEdits,
            imageEdits: {},
            hiddenSelectors: safe.hiddenSelectors,
            sectionVisibility: safe.sectionVisibility,
            addedCards: safe.addedCards,
            valueSection: safe.valueSection,
            imageSection: safe.imageSection,
            itemType: safe.itemType,
            activeTab: safe.activeTab,
            activeItemTypeTab: safe.activeItemTypeTab,
            activeSectionId: safe.activeSectionId,
            adminToolsExpanded: safe.adminToolsExpanded
        };
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            localStorage.setItem(STORAGE_ADDED_KEY, JSON.stringify(state.addedCards || []));
            localStorage.removeItem(STORAGE_LIGHT_KEY);
        } catch (error) {
            try {
                const lightState = buildLightStateSnapshot(state);
                localStorage.removeItem(STORAGE_KEY);
                localStorage.setItem(STORAGE_LIGHT_KEY, JSON.stringify(lightState));
                localStorage.setItem(STORAGE_ADDED_KEY, JSON.stringify(lightState.addedCards || []));
                showStatus(
                    state.lang === 'ar'
                        ? 'تم حفظ الإضافات والتعديلات النصية. الصور الكبيرة قد لا تُحفظ بسبب سعة المتصفح.'
                        : 'Added items and text edits were saved. Large images may not persist due to browser storage limit.',
                    true
                );
            } catch (fallbackError) {
                showStatus(t('storageLimit'), true);
            }
        }
    }
})();

