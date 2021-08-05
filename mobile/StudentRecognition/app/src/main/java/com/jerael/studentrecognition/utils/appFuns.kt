package com.jerael.studentrecognition.utils

import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.JsonObject
import com.jerael.studentrecognition.models.AuthResponse
import com.jerael.studentrecognition.models.PasswordRecoveryResponse
import com.jerael.studentrecognition.models.ResultResponse
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.File

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

                if (type == "administrator") {
                    val message = "Администраторы должны использовать веб-приложение"
                    val title = "Сообщение"
                    showAlertDialog(context, message, title)
                    function(false)
                } else {
                    function(true)
                }

            } else {
                try {
                    val errorMessage =
                        JSONObject(response.errorBody()!!.string()).getString("error")
                    context.showToast(errorMessage)
                } catch (e: Exception) {
                    context.showToast(e.message.toString())
                }
                function(false)
            }
        }

        override fun onFailure(call: Call<AuthResponse>, t: Throwable) {
            context.showToast("Что-то пошло не так")
            function(false)
        }

    })

}

private fun showAlertDialog(context: AppCompatActivity, message: String, title: String) {
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

    val call = Server.createServer("http://192.168.0.42:5000").passwordRecovery(loginRB, wordRB)

    call.enqueue(object : Callback<PasswordRecoveryResponse> {
        override fun onResponse(
            call: Call<PasswordRecoveryResponse>,
            response: Response<PasswordRecoveryResponse>
        ) {
            if (response.isSuccessful) {

                val password = response.body()?.password.toString()

                function(password)
            } else {
                try {
                    val errorMessage =
                        JSONObject(response.errorBody()!!.string()).getString("error")
                    context.showToast(errorMessage)
                } catch (e: Exception) {
                    context.showToast(e.message.toString())
                }
                function(null)
            }
        }

        override fun onFailure(call: Call<PasswordRecoveryResponse>, t: Throwable) {
            context.showToast("Что-то пошло не так")
            function(null)
        }

    })

}

fun sendPhoto(context: AppCompatActivity, photoFile: File, function: (String?) -> Unit) {

    val requestFile: RequestBody = photoFile.asRequestBody("image/*".toMediaTypeOrNull())

    val body = MultipartBody.Part.createFormData("file", photoFile.name, requestFile)

    val token = TokenUtil.getToken(context).toString()

    val call = Server.createServer("http://192.168.0.42:5000").sendPhoto(token, body)

    call.enqueue(object : Callback<ResultResponse> {
        override fun onResponse(
            call: Call<ResultResponse>,
            response: Response<ResultResponse>
        ) {
            if (response.isSuccessful) {

                val fio = response.body()?.fio.toString()

                function(fio)

            } else {
                var errorMessage: String? = null

                try {
                    errorMessage = JSONObject(response.errorBody()!!.string()).getString("error")
                } catch (e: Exception) {
                    context.showToast(e.message.toString())
                }

                function(errorMessage)
            }
        }

        override fun onFailure(call: Call<ResultResponse>, t: Throwable?) {
            context.showToast("Что-то пошло не так")
            function(null)
        }
    })

}

