package com.jerael.universityscheduler.utils

import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.jerael.universityscheduler.models.AuthResponse
import com.jerael.universityscheduler.models.PasswordRecoveryResponse
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody


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


    val call = Server.createServer("http://192.168.0.42:5000").auth(loginRB, passwordRB)

    call.enqueue(object : Callback<AuthResponse> {
        override fun onResponse(call: Call<AuthResponse>, response: Response<AuthResponse>) {
            if (response.isSuccessful) {
                val token = response.body()?.token.toString()
                val type = response.body()?.type.toString()

                TokenUtil.setToken(context, token)

                Log.d("asd", TokenUtil.getToken(context).toString())

                if (type == "administrator") {
                    val message = "Администраторы должны использовать веб-приложение"
                    val title = "Сообщение"
                    showAlertDialog(context, message, title)
                    function(false)
                }

                function(true)
            } else {
                //val errorMessage = JsonObject().getAsJsonObject(response.body().toString()).getAsJsonPrimitive("error").asString
                context.showToast(response.body().toString())
                //TODO:
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
    val dialog = AlertDialog.Builder(context).setTitle(title).setMessage(message).setPositiveButton("OK"
    ) { dialog, which -> }

    dialog.show()
}

fun recoveryPassword(context: AppCompatActivity, login: String, fio: String, function: (String?) -> Unit) {

    val loginRB: RequestBody = login.toRequestBody("text/plain".toMediaTypeOrNull())
    val fioRB: RequestBody = fio.toRequestBody("text/plain".toMediaTypeOrNull())

    val call = Server.createServer("http://192.168.0.42:5000").passwordRecovery(loginRB, fioRB)

    call.enqueue(object : Callback<PasswordRecoveryResponse> {
        override fun onResponse(call: Call<PasswordRecoveryResponse>, response: Response<PasswordRecoveryResponse>) {
            if (response.isSuccessful) {

                val password = response.body()?.password.toString()

                function(password)
            } else {
                //val errorMessage = JsonObject().getAsJsonObject(response.body().toString()).getAsJsonPrimitive("error").asString
                context.showToast(response.body().toString())
                //TODO:
                function(null)
            }
        }

        override fun onFailure(call: Call<PasswordRecoveryResponse>, t: Throwable) {
            context.showToast("Что-то пошло не так")
            function(null)
        }

    })

}