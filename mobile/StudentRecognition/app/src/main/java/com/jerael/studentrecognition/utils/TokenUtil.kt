package com.jerael.studentrecognition.utils

import android.content.Context
import android.content.SharedPreferences

private const val TOKEN = "TOKEN"

class TokenUtil {

    companion object {

        fun getToken(context: Context): String? {
            val prefs: SharedPreferences = context.getSharedPreferences(TOKEN, Context.MODE_PRIVATE)
            return prefs.getString(TOKEN, null)
        }

        fun setToken(context: Context, newToken: String) {
            val prefs: SharedPreferences = context.getSharedPreferences(TOKEN, Context.MODE_PRIVATE)
            prefs.edit().putString(TOKEN, newToken).apply()
        }

    }

}