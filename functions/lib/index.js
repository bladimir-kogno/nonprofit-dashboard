"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSendGridWebhook = exports.sendEmail = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const sendEmail_1 = require("./sendEmail");
Object.defineProperty(exports, "sendEmail", { enumerable: true, get: function () { return sendEmail_1.sendEmail; } });
const v2_1 = require("firebase-functions/v2");
(0, v2_1.setGlobalOptions)({ region: "us-central1" });
exports.handleSendGridWebhook = functions.https.onRequest(async (req, res) => {
    console.log("Received webhook event:", req.body);
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    try {
        const events = req.body;
        if (!Array.isArray(events)) {
            res.status(400).send("Invalid payload");
            return;
        }
        const db = admin.firestore();
        const batch = db.batch();
        for (const event of events) {
            if (!event.email)
                continue;
            const snapshot = await db
                .collection("contacts")
                .where("email", "==", event.email)
                .limit(1)
                .get();
            if (snapshot.empty)
                continue;
            const docRef = snapshot.docs[0].ref;
            const updates = {};
            if (event.event === "open") {
                updates.engagement = {
                    emailsOpened: admin.firestore.FieldValue.increment(1),
                    lastOpened: admin.firestore.Timestamp.now(),
                };
            }
            else if (event.event === "unsubscribe") {
                updates.status = "unsubscribed";
            }
            batch.set(docRef, updates, { merge: true });
        }
        await batch.commit();
        res.status(200).send("Events processed");
    }
    catch (error) {
        console.error("Webhook error:", error);
        res.status(500).send("Internal Server Error");
    }
});
//# sourceMappingURL=index.js.map