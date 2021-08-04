package com.jerael.universityscheduler.utils

import com.jerael.universityscheduler.models.AuthResponse
import com.jerael.universityscheduler.models.PasswordRecoveryResponse
import okhttp3.OkHttpClient
import okhttp3.RequestBody
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.create
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
        @Part("fio") fio: RequestBody
    ): Call<PasswordRecoveryResponse>

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