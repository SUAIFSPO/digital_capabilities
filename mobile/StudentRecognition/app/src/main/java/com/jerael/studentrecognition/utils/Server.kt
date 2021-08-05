package com.jerael.studentrecognition.utils

import com.jerael.studentrecognition.models.AuthResponse
import com.jerael.studentrecognition.models.PasswordRecoveryResponse
import com.jerael.studentrecognition.models.ResultResponse
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.RequestBody
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.create
import retrofit2.http.Header
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part

interface Server {

    @Multipart
    @POST("auth/login")
    fun auth(
        @Part("login") login: RequestBody,
        @Part("password") password: RequestBody
    ): Call<AuthResponse>

    @Multipart
    @POST("auth/recovery")
    fun passwordRecovery(
        @Part("login") login: RequestBody,
        @Part("word") word: RequestBody
    ): Call<PasswordRecoveryResponse>

    @Multipart
    @POST("users/identity")
    fun sendPhoto(
        @Header("Token") token: String,
        @Part file: MultipartBody.Part
    ): Call<ResultResponse>

    companion object {

        fun createServer(url: String): Server {

            val logging = HttpLoggingInterceptor()
            logging.setLevel(HttpLoggingInterceptor.Level.BODY)
            val client: OkHttpClient.Builder = OkHttpClient.Builder()
                .addInterceptor(logging)

            val retrofit = Retrofit.Builder()
                .baseUrl(url)
                .addConverterFactory(GsonConverterFactory.create())
                .client(client.build())
                .build()

            return retrofit.create()

        }

    }

}