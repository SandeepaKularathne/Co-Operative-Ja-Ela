package lk.cooperative.cooperativejaela.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class CountByCRDate {

    @Id
    private Integer id;
    private int year;
    private int Month;
    private String Gender;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return Month;
    }

    public void setMonth(int month) {
        Month = month;
    }

    public String getGender() {
        return Gender;
    }

    public void setGender(String gender) {
        Gender = gender;
    }

    public Long getTcount() {
        return tcount;
    }

    public void setTcount(Long tcount) {
        this.tcount = tcount;
    }

    private Long tcount;

    public CountByCRDate() {  }

    public CountByCRDate( int year, int month, String gender, Long tcount) {
        this.year = year;
        Month = month;
        Gender = gender;
        this.tcount = tcount;
    }

}
