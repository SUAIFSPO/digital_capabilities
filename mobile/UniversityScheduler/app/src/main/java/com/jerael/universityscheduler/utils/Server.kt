package com.jerael.universityscheduler.utils

import com.jerael.universityscheduler.models.ActivitiesResponse
import com.jerael.universityscheduler.models.AuthResponse
import com.jerael.universityscheduler.models.PasswordRecoveryResponse
import okhttp3.OkHttpClient
import okhttp3.RequestBody
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.create
import retrofit2.http.*
import com.google.gson.GsonBuilder

import com.google.gson.Gson

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

    @POST("activities/getSchedule/{startDate}/{endDate}")
    fun getSchedule(
        //@Header("Token") token: String,
        @Path("startDate") startDate: Long,
        @Path("endDate") endDate: Long
    ): Call<ActivitiesResponse>

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