package lk.cooperative.cooperativejaela.entity;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Entity
public class Disreceive {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "date")
    private Date date;
    @Basic
    @Column(name = "description")
    private String description;
    @ManyToOne
    @JoinColumn(name = "disorder_id", referencedColumnName = "id", nullable = false)
    private Disorder disorder;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @Basic
    @Column(name = "disrecnumber")
    private String disrecnumber;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Disreceive that = (Disreceive) o;
        return id == that.id && Objects.equals(date, that.date) && Objects.equals(description, that.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, date, description);
    }

    public Disorder getDisorder() {
        return disorder;
    }

    public void setDisorder(Disorder disorder) {
        this.disorder = disorder;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getDisrecnumber() {
        return disrecnumber;
    }

    public void setDisrecnumber(String disrecnumber) {
        this.disrecnumber = disrecnumber;
    }
}
