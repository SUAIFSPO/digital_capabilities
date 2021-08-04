package com.jerael.universityscheduler.ui

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import com.jerael.universityscheduler.R
import com.jerael.universityscheduler.utils.getSchedule
import com.jerael.universityscheduler.utils.showToast
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.*

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        this.title = "Расписание занятий"

        val daysList: MutableList<String> = mutableListOf()

        val formatter = DateTimeFormatter.ofPattern("EEEE, d MMMM")

        val currentDate = LocalDate.now()

        val startDate = currentDate.atStartOfDay(ZoneId.systemDefault()).toEpochSecond()

        val endDate = currentDate.plusDays(7).atStartOfDay(ZoneId.systemDefault()).toEpochSecond()

        for (i in 0 until 8) {
            val newDate = currentDate.plusDays(i.toLong()).format(formatter)
            daysList.add(newDate)
            Log.d("asd", daysList[i])
        }



        getSchedule(this, startDate, endDate) {

        }
    }
}