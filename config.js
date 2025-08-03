// YouTube API configuration
export const config = {
    API_KEY: "AIzaSyCH3t-PK-syEy-8x94GY8PLSPmBGCq7324",  // Your API key
    UPDATE_INTERVAL: 5000,  // Update messages every 5 seconds
    MAX_CHAT_MESSAGES: 100,  // Maximum messages displayed
    DOWNLOAD_LINK: "https://www.up-4ever.net/ma4sed6sxuv2", // Download link to show after finding user
    AD_DIRECT_LINK: "https://www.profitableratecpm.com/kk2sreib?key=86a7faa4aa1d66823d4b1941fcadcb6f", // Direct ad link for button clicks
    DEFAULT_VIDEO_ID: "KbH9d0PwEdA", // Default video ID
    HARDCODED_CHAT_ID: "", // Hardcoded chatId for default video - set to empty to always fetch via API
    FILE_NAME: "YourAwesomeFile.zip", // Display name of the download file
    FILE_SIZE: "15.3 MB", // Display size of the download file
    RANDOM_KEYWORDS: [
        "استمر مستر مودر!",
        "وحش والله!",
        "خد متابعه يا غالي",
        "شغلنه عال العال",
        "مستر مودر بطل!",
        "تسلم ايدك",
        "لا توقف يابه!",
        "اسطوره مستر مودر",
        "متابعه عالطول",
        "استمرر يا وحش.",
        "مستر مودر وحش!",
        "خد متابعه يا معلم",
        "استمر كده",
        "تسلم ايدك",
        "وحش موت!",
        "متابعه فوراً",
        "شكراً مستر مودر",
        "فيديو جامد",
        "ما توقفش",
        "بطل مستر مودر"
    ],
    // Timestamps to prevent old message detection
    MESSAGE_FRESHNESS_SECONDS: 60, // Only detect messages newer than this many seconds
    MAX_CLAIM_TIME_SECONDS: 300, // Maximum time a word can be claimed (5 minutes)
    // Translations for UI elements
    TRANSLATIONS: {
        title: {
            en: "Live Chat Download",
            ar: "تحميل من الدردشة المباشرة"
        },
        randomWord: {
            en: "Password to type in chat:",
            ar: "كلمة المرور المطلوب كتابتها في الدردشة:"
        },
        newWord: {
            en: "New Password",
            ar: "كلمة مرور جديدة"
        },
        stopMonitoring: {
            en: "Stop Monitoring",
            ar: "إيقاف المراقبة"
        },
        startMonitoring: {
            en: "Start Monitoring",
            ar: "بدء المراقبة"
        },
        monitoringStarted: {
            en: "Starting monitoring...",
            ar: "جاري بدء المراقبة..."
        },
        monitoringStopped: {
            en: "Monitoring stopped",
            ar: "تم إيقاف المراقبة"
        },
        connecting: {
            en: "Connecting to live chat...",
            ar: "جاري الاتصال بالدردشة المباشرة..."
        },
        foundUser: {
            en: "Found message from required user!",
            ar: "تم العثور على رسالة من المستخدم المطلوب!"
        },
        downloadFile: {
            en: "Download File",
            ar: "تحميل الملف"
        },
        notFound: {
            en: "Not found",
            ar: "لا يوجد"
        },
        keywordFound: {
            en: `The word "{keyword}" was found in a message from {user}!`,
            ar: `تم العثور على الكلمة "{keyword}" في رسالة من {user}!`
        },
        searching: {
            en: "Searching for live stream...",
            ar: "جاري البحث عن البث المباشر..."
        },
        useKeyword: {
            en: "Use the password in the chat!",
            ar: "استخدم كلمة المرور في الدردشة!"
        },
        chatConnected: {
            en: "Connected to live chat! Fetching messages...",
            ar: "تم الاتصال بالدردشة المباشرة! جاري جلب الرسائل..."
        },
        noChatFound: {
            en: "No live chat found for this video",
            ar: "لم يتم العثور على دردشة مباشرة لهذا الفيديو"
        },
        invalidVideoId: {
            en: "Invalid video ID",
            ar: "معرف الفيديو غير صالح"
        },
        errorOccurred: {
            en: "Error occurred:",
            ar: "حدث خطأ:"
        },
        error: {
            en: "Error: ",
            ar: "حدث خطأ: "
        },
        keywordNotFound: {
            en: `The word '{keyword}' was not found in any new message`,
            ar: `لم يتم العثور على الكلمة '{keyword}' في أي رسالة جديدة`
        },
        newMessages: {
            en: "Fetched {count} new messages",
            ar: "تم جلب {count} رسائل جديدة"
        },
        noNewMessages: {
            en: "No new messages",
            ar: "لا توجد رسائل جديدة"
        },
        noMessages: {
            en: "No messages currently",
            ar: "لا توجد رسائل حالياً"
        },
        downloadConditions: {
            en: "Please subscribe to the channel and type the password in chat",
            ar: "يرجى الاشتراك في القناة وكتابة كلمة المرور في الدردشة"
        },
        claimedBy: {
            en: "This word has already been claimed by another user",
            ar: "تم استخدام هذه الكلمة بواسطة مستخدم آخر"
        },
        messageExpired: {
            en: "Message is too old, try a newer message",
            ar: "الرسالة قديمة جدًا، حاول استخدام رسالة أحدث"
        },
        completeConditions: {
            en: "Please complete the conditions to download",
            ar: "يرجى إكمال الشروط للتحميل"
        },
        subscribeChannel: {
            en: "Subscribe to Channel",
            ar: "اشترك في القناة"
        },
        readyToMonitor: {
            en: "Ready to check chat. Click 'Check Chat' to begin monitoring.",
            ar: "جاهز للتحقق من الدردشة. اضغط على 'تحقق من الدردشة' للبدء."
        },
        checkButton: {
            en: "Check Chat",
            ar: "تحقق من الدردشة"
        },
        checking: {
            en: "Checking...",
            ar: "جاري التحقق..."
        },
        verified: {
            en: "Verified",
            ar: "تم التحقق"
        }
    }
};
