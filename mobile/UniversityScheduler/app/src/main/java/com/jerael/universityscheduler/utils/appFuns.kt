package com.jerael.universityscheduler.utils

import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.*
import com.jerael.universityscheduler.models.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


fun AppCompatActivity.showToast(message: String) {
    Toast.makeText(this, message, Toast.LENGTH_LONG).show()
}

fun login(
    context: AppCompatActivity,
    login: String,
    password: String,
    function: (Boolean) -> Unit
) {

    val loginRB: RequestBody = login.toRequestBody("text/plain".toMediaTypeOrNull())
    val passwordRB: RequestBody = password.toRequestBody("text/plain".toMediaTypeOrNull())

    val call = Server.createServer("http://3.17.59.226").auth(loginRB, passwordRB)

    call.enqueue(object : Callback<AuthResponse> {
        override fun onResponse(call: Call<AuthResponse>, response: Response<AuthResponse>) {
            if (response.isSuccessful) {
                val token = response.body()?.token.toString()
                val type = response.body()?.type.toString()

                TokenUtil.setToken(context, token)

                if (type == "administrator") {
                    val message = "Администраторы должны использовать веб-приложение"
                    val title = "Сообщение"
                    showAlertDialog(context, message, title)
                    function(false)
                }

                function(true)
            } else {
                context.showToast("Неправильный логин или пароль")
                function(false)
            }
        }

        override fun onFailure(call: Call<AuthResponse>, t: Throwable) {
            context.showToast("Что-то пошло не так")
            function(false)
        }

    })

}

fun showAlertDialog(context: AppCompatActivity, message: String, title: String) {
    val dialog = AlertDialog.Builder(context).setTitle(title).setMessage(message).setPositiveButton(
        "OK"
    ) { dialog, which -> }

    dialog.show()
}

fun recoveryPassword(
    context: AppCompatActivity,
    login: String,
    word: String,
    function: (String?) -> Unit
) {

    val loginRB: RequestBody = login.toRequestBody("text/plain".toMediaTypeOrNull())
    val wordRB: RequestBody = word.toRequestBody("text/plain".toMediaTypeOrNull())

    val call = Server.createServer("http://3.17.59.226").passwordRecovery(loginRB, wordRB)

    call.enqueue(object : Callback<PasswordRecoveryResponse> {
        override fun onResponse(
            call: Call<PasswordRecoveryResponse>,
            response: Response<PasswordRecoveryResponse>
        ) {
            if (response.isSuccessful) {

                val password = response.body()?.password.toString()

                function(password)
            } else {
                context.showToast("Кодовое слово или Логин неверны")
                function(null)
            }
        }

        override fun onFailure(call: Call<PasswordRecoveryResponse>, t: Throwable) {
            context.showToast("Что-то пошло не так")
            function(null)
        }

    })

}

fun getSchedule(context: AppCompatActivity, startDate: Long, endDate: Long, function: (MutableList<Activity>?) -> Unit) {

    val token = TokenUtil.getToken(context).toString()

    val call = Server.createServer("http://3.17.59.226").getSchedule(startDate, endDate)

    call.enqueue(object : Callback<ActivitiesResponse> {
        override fun onResponse(
            call: Call<ActivitiesResponse>,
            response: Response<ActivitiesResponse>
        ) {
            if (response.isSuccessful) {

                val activitiesJsonArray = response.body()?.schedule

                val activities: MutableList<Activity> = mutableListOf()

                for (i in 0 until activitiesJsonArray!!.size()) {

                    val listenersJsonArray =
                        activitiesJsonArray[i].asJsonObject.getAsJsonArray("listeners")

                    val listeners: MutableList<Listener> = mutableListOf()

                    for (j in 0 until listenersJsonArray.size()) {

                        val listener = Listener(
                            listenersJsonArray[j].asJsonObject.getAsJsonPrimitive("id").asInt,
                            listenersJsonArray[j].asJsonObject.getAsJsonPrimitive("number").asString
                        )

                        listeners.add(listener)
                    }

                    val activity = Activity(
                        activitiesJsonArray[i].asJsonObject.getAsJsonPrimitive("id").asInt,
                        activitiesJsonArray[i].asJsonObject.getAsJsonPrimitive("name").asString,
                        activitiesJsonArray[i].asJsonObject.getAsJsonPrimitive("startTime").asString,
                        activitiesJsonArray[i].asJsonObject.getAsJsonPrimitive("endTime").asString,
                        listeners,
                        activitiesJsonArray[i].asJsonObject.getAsJsonPrimitive("fio").asString,
                        activitiesJsonArray[i].asJsonObject.getAsJsonPrimitive("link").asString
                    )

                    activities.add(activity)
                }

                function(activities)
            } else {
                context.showToast("Что-то пошло не так")
                function(null)
            }
        }

        override fun onFailure(call: Call<ActivitiesResponse>, t: Throwable) {
            context.showToast("Что-то пошло не так")
            function(null)
        }

    })

}